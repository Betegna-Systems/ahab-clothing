-- Promo codes managed in the admin app instead of hard-coded in the storefront.
-- placeOrder prices orders from these rows; place_order_with_inventory re-checks the code
-- while saving the order (with a row lock), so a usage limit can't be exceeded by
-- concurrent checkouts. A use counts while its order is not cancelled — cancelling an order
-- frees the use again.

create table if not exists public.promo_codes (
  code text primary key check (code ~ '^[A-Z0-9]{3,20}$'),
  percent_off integer not null check (percent_off between 1 and 90),
  active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  min_subtotal integer not null default 0 check (min_subtotal >= 0),
  note text not null default '' check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at is null or expires_at is null or expires_at > starts_at)
);

alter table public.promo_codes enable row level security;
revoke all on public.promo_codes from anon, authenticated;
grant select, insert, update, delete on public.promo_codes to authenticated;
grant all on public.promo_codes to service_role;

drop policy if exists "promo_codes_admin_manage" on public.promo_codes;
create policy "promo_codes_admin_manage"
  on public.promo_codes
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Keep today's codes working exactly as before (no expiry, no limit).
insert into public.promo_codes (code, percent_off, note)
values
  ('AHAB10', 10, 'Original storefront code'),
  ('MADEWITHLOVE', 15, 'Original storefront code')
on conflict (code) do nothing;

-- Which code an order used (for usage limits and reporting).
alter table public.orders
  add column if not exists promo_code text;

create index if not exists orders_promo_code_idx
  on public.orders (promo_code)
  where promo_code is not null;

create or replace function public.place_order_with_inventory(p_order jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  variant record;
  available_quantity integer;
  v_promo_code text := nullif(upper(btrim(coalesce(p_order ->> 'promoCode', ''))), '');
  v_promo public.promo_codes%rowtype;
  v_promo_uses integer;
begin
  if v_promo_code is not null then
    -- Lock the code so concurrent checkouts can't both take its last use.
    select * into v_promo from public.promo_codes where code = v_promo_code for update;
    if not found
      or not v_promo.active
      or (v_promo.starts_at is not null and v_promo.starts_at > now())
      or (v_promo.expires_at is not null and v_promo.expires_at <= now())
      or (p_order ->> 'subtotal')::numeric < v_promo.min_subtotal
      or coalesce((p_order ->> 'promoPercent')::integer, -1) <> v_promo.percent_off
    then
      return jsonb_build_object('ok', false, 'reason', 'promo_unavailable');
    end if;

    if v_promo.max_uses is not null then
      select count(*) into v_promo_uses
        from public.orders
        where orders.promo_code = v_promo_code
          and lower(btrim(orders.status)) not in ('cancelled', 'canceled');
      if v_promo_uses >= v_promo.max_uses then
        return jsonb_build_object('ok', false, 'reason', 'promo_unavailable');
      end if;
    end if;
  end if;

  for variant in
    select
      item ->> 'slug' as product_slug,
      item ->> 'color' as color,
      item ->> 'size' as size,
      sum((item ->> 'qty')::integer)::integer as requested_quantity
    from jsonb_array_elements(p_order -> 'items') as items(item)
    group by item ->> 'slug', item ->> 'color', item ->> 'size'
    order by item ->> 'slug', item ->> 'color', item ->> 'size'
  loop
    select inventory.quantity
      into available_quantity
      from public.product_variant_inventory as inventory
      where inventory.product_slug = variant.product_slug
        and inventory.color = variant.color
        and inventory.size = variant.size
      for update;

    if not found then
      return jsonb_build_object('ok', false, 'reason', 'unavailable');
    end if;

    if available_quantity < variant.requested_quantity then
      return jsonb_build_object('ok', false, 'reason', 'insufficient_stock');
    end if;
  end loop;

  for variant in
    select
      item ->> 'slug' as product_slug,
      item ->> 'color' as color,
      item ->> 'size' as size,
      sum((item ->> 'qty')::integer)::integer as requested_quantity
    from jsonb_array_elements(p_order -> 'items') as items(item)
    group by item ->> 'slug', item ->> 'color', item ->> 'size'
    order by item ->> 'slug', item ->> 'color', item ->> 'size'
  loop
    update public.product_variant_inventory
      set quantity = quantity - variant.requested_quantity,
          updated_at = now()
      where product_slug = variant.product_slug
        and color = variant.color
        and size = variant.size;
  end loop;

  insert into public.orders (
    order_number,
    customer_name,
    phone,
    email,
    sub_city,
    city,
    address,
    items,
    image_url,
    subtotal,
    delivery,
    total,
    payment_method,
    notes,
    payment_access_token_hash,
    customer_user_id,
    promo_code,
    payment_status,
    inventory_reserved_at,
    created_at
  )
  values (
    p_order ->> 'orderNumber',
    p_order #>> '{customer,name}',
    p_order #>> '{customer,phone}',
    nullif(p_order #>> '{customer,email}', ''),
    nullif(p_order #>> '{customer,subCity}', ''),
    nullif(p_order #>> '{customer,city}', ''),
    nullif(p_order #>> '{customer,address}', ''),
    p_order -> 'items',
    p_order #>> '{items,0,image}',
    (p_order ->> 'subtotal')::numeric,
    (p_order ->> 'shipping')::numeric,
    (p_order ->> 'total')::numeric,
    p_order ->> 'paymentMethod',
    nullif(p_order ->> 'notes', ''),
    p_order ->> 'paymentAccessTokenHash',
    nullif(p_order ->> 'customerUserId', '')::uuid,
    v_promo_code,
    case
      when p_order ->> 'paymentMethod' = 'Cash on delivery' then 'not_required'
      else 'pending'
    end,
    now(),
    (p_order ->> 'createdAt')::timestamptz
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.place_order_with_inventory(jsonb) from public, anon, authenticated;
grant execute on function public.place_order_with_inventory(jsonb) to service_role;
