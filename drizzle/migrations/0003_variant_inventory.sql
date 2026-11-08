alter table public.orders
  add column if not exists inventory_reserved_at timestamptz,
  add column if not exists inventory_released_at timestamptz;

create table if not exists public.product_variant_inventory (
  product_slug text not null check (product_slug ~ '^[a-z0-9-]{1,120}$'),
  color text not null check (length(color) between 1 and 100),
  size text not null check (length(size) between 1 and 20),
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  primary key (product_slug, color, size)
);

revoke all on public.product_variant_inventory from anon, authenticated;
grant select, insert, update, delete on public.product_variant_inventory to authenticated;
grant all on public.product_variant_inventory to service_role;

comment on table public.product_variant_inventory is
  'Manage live stock by product slug, exact color name, and size; missing or zero quantities are unavailable.';

alter table public.product_variant_inventory enable row level security;

drop policy if exists "variant_inventory_admin_access" on public.product_variant_inventory;
create policy "variant_inventory_admin_access"
  on public.product_variant_inventory
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.set_variant_inventory_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_variant_inventory_updated_at on public.product_variant_inventory;
create trigger set_variant_inventory_updated_at
  before update on public.product_variant_inventory
  for each row
  execute function public.set_variant_inventory_updated_at();

revoke all on function public.set_variant_inventory_updated_at() from public, anon, authenticated;

create or replace function public.place_order_with_inventory(p_order jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  variant record;
  available_quantity integer;
begin
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
    from jsonb_array_elements(new.items) as items(item)
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

drop trigger if exists release_cancelled_order_inventory on public.orders;
create trigger release_cancelled_order_inventory
  before update on public.orders
  for each row
  execute function public.release_cancelled_order_inventory();
