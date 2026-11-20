-- Security hardening (from the 2026-11-21 security review).
--
-- 1. Admins (authenticated users with the admin role) may change only the order columns the
--    admin app edits: status, payment_status and archived_at. They can no longer rewrite
--    items, totals, inventory_* timestamps or customer_user_id. Checkout, receipts and
--    in-person sales run as service_role or through security-definer functions, unaffected.
-- 2. Cancelling restocks what was originally reserved (old.items), not whatever the same
--    UPDATE writes into items.
-- 3. A server-only rate-limit counter used by placeOrder and checkPromoCode (per IP).
--
-- Safe to run more than once.

-- 1. Column-level update rights for admins on orders.
revoke update on public.orders from authenticated;
grant update (status, payment_status, archived_at) on public.orders to authenticated;

-- 2. Restock from the reserved items.
-- Items without a product slug (custom / unlisted pieces) were never taken from stock,
-- so cancelling must not try to put them back.
create or replace function public.release_cancelled_order_inventory()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  variant record;
begin
  if new.inventory_reserved_at is null
    or new.inventory_released_at is not null
    or lower(trim(new.status)) not in ('cancelled', 'canceled')
  then
    return new;
  end if;

  for variant in
    select
      item ->> 'slug' as product_slug,
      item ->> 'color' as color,
      item ->> 'size' as size,
      sum((item ->> 'qty')::integer)::integer as reserved_quantity
    from jsonb_array_elements(old.items) as items(item)
    where coalesce(item ->> 'slug', '') <> ''
    group by item ->> 'slug', item ->> 'color', item ->> 'size'
    order by item ->> 'slug', item ->> 'color', item ->> 'size'
  loop
    insert into public.product_variant_inventory (product_slug, color, size, quantity, updated_at)
    values (
      variant.product_slug,
      variant.color,
      variant.size,
      variant.reserved_quantity,
      now()
    )
    on conflict (product_slug, color, size)
    do update set
      quantity = public.product_variant_inventory.quantity + excluded.quantity,
      updated_at = now();
  end loop;

  new.inventory_released_at := now();
  return new;
end;
$$;

revoke all on function public.release_cancelled_order_inventory() from public, anon, authenticated;

-- 3. Rate limiting (service_role only; keys are SHA-256 hashes, never raw IPs).
create table if not exists public.request_rate_limits (
  id bigint generated always as identity primary key,
  bucket text not null,
  key_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists request_rate_limits_lookup_idx
  on public.request_rate_limits (bucket, key_hash, created_at);

alter table public.request_rate_limits enable row level security;
revoke all on public.request_rate_limits from public, anon, authenticated;
grant all on public.request_rate_limits to service_role;

-- Records one hit and returns true if it is within p_limit hits per p_window_seconds.
create or replace function public.take_rate_limit(
  p_bucket text,
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hits integer;
begin
  if p_limit < 1 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit';
  end if;

  -- Serialise hits for the same key so parallel requests can't slip past the count.
  perform pg_advisory_xact_lock(hashtextextended(p_bucket || ':' || p_key_hash, 0));

  delete from public.request_rate_limits
  where bucket = p_bucket
    and key_hash = p_key_hash
    and created_at < now() - make_interval(secs => p_window_seconds);

  select count(*) into v_hits
  from public.request_rate_limits
  where bucket = p_bucket and key_hash = p_key_hash;

  if v_hits >= p_limit then
    return false;
  end if;

  insert into public.request_rate_limits (bucket, key_hash) values (p_bucket, p_key_hash);

  -- Occasionally clear out keys that never came back.
  if random() < 0.01 then
    delete from public.request_rate_limits where created_at < now() - interval '2 days';
  end if;

  return true;
end;
$$;

revoke all on function public.take_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.take_rate_limit(text, text, integer, integer) to service_role;
