-- In-person (shop / walk-in) sales recorded from the admin app.
--
-- They are stored as rows in public.orders with source = 'in_person', already paid and
-- delivered, so the admin app's Sales report counts them alongside website orders.
-- Pieces picked from the catalog are taken out of product_variant_inventory; cancelling
-- the sale later puts them back through the existing release trigger.

alter table public.orders
  add column if not exists source text not null default 'website';

alter table public.orders
  drop constraint if exists orders_source_check;
alter table public.orders
  add constraint orders_source_check check (source in ('website', 'in_person'));

comment on column public.orders.source is
  'Where the sale happened: website checkout, or in_person (recorded by an admin).';

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
    from jsonb_array_elements(new.items) as items(item)
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

-- p_sale:
-- {
--   "items": [{"slug": "...", "name": "...", "color": "...", "size": "...",
--              "qty": 1, "price": 4500, "image": "https://..."}],   -- slug optional
--   "customerName": "...", "phone": "...", "paymentMethod": "Cash",
--   "notes": "...", "soldAt": "2026-11-20T10:00:00Z"                  -- all optional
-- }
-- Returns {"ok": true, "orderNumber": "SHOP-XXXXXXXX"} or
-- {"ok": false, "reason": "unavailable" | "insufficient_stock", "item": "...", "available": n}.
create or replace function public.record_in_person_sale(p_sale jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  item jsonb;
  variant record;
  available_quantity integer;
  v_items_count integer;
  v_subtotal numeric := 0;
  v_qty integer;
  v_price numeric;
  v_payment_method text := coalesce(nullif(trim(p_sale ->> 'paymentMethod'), ''), 'Cash');
  v_sold_at timestamptz := coalesce(nullif(p_sale ->> 'soldAt', '')::timestamptz, now());
  v_has_stock_items boolean := false;
  v_order_number text;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Only admins can record sales.' using errcode = '42501';
  end if;

  if jsonb_typeof(p_sale -> 'items') <> 'array' then
    raise exception 'A sale needs at least one item.' using errcode = '22023';
  end if;
  v_items_count := jsonb_array_length(p_sale -> 'items');
  if v_items_count < 1 or v_items_count > 50 then
    raise exception 'A sale needs between 1 and 50 items.' using errcode = '22023';
  end if;

  if v_payment_method not in ('Cash', 'Telebirr', 'CBE bank transfer', 'Other bank transfer', 'Card') then
    raise exception 'Unknown payment method: %', v_payment_method using errcode = '22023';
  end if;

  if v_sold_at > now() + interval '1 day' then
    raise exception 'The sale date cannot be in the future.' using errcode = '22023';
  end if;

  for item in select * from jsonb_array_elements(p_sale -> 'items')
  loop
    v_qty := (item ->> 'qty')::integer;
    v_price := (item ->> 'price')::numeric;
    if v_qty is null or v_qty < 1 or v_qty > 1000 then
      raise exception 'Each item needs a quantity of at least 1.' using errcode = '22023';
    end if;
    if v_price is null or v_price < 0 then
      raise exception 'Each item needs a price.' using errcode = '22023';
    end if;
    if length(coalesce(trim(item ->> 'name'), '')) = 0 then
      raise exception 'Each item needs a name.' using errcode = '22023';
    end if;
    v_subtotal := v_subtotal + v_qty * v_price;
    if coalesce(item ->> 'slug', '') <> '' then
      v_has_stock_items := true;
    end if;
  end loop;

  -- Check every stocked variant first (locking the rows), then take the pieces out.
  for variant in
    select
      i ->> 'slug' as product_slug,
      i ->> 'color' as color,
      i ->> 'size' as size,
      min(i ->> 'name') as item_name,
      sum((i ->> 'qty')::integer)::integer as requested_quantity
    from jsonb_array_elements(p_sale -> 'items') as items(i)
    where coalesce(i ->> 'slug', '') <> ''
    group by i ->> 'slug', i ->> 'color', i ->> 'size'
    order by i ->> 'slug', i ->> 'color', i ->> 'size'
  loop
    select inventory.quantity
      into available_quantity
      from public.product_variant_inventory as inventory
      where inventory.product_slug = variant.product_slug
        and inventory.color = variant.color
        and inventory.size = variant.size
      for update;

    if not found then
      return jsonb_build_object(
        'ok', false, 'reason', 'unavailable',
        'item', format('%s (%s, %s)', variant.item_name, variant.color, variant.size),
        'available', 0);
    end if;

    if available_quantity < variant.requested_quantity then
      return jsonb_build_object(
        'ok', false, 'reason', 'insufficient_stock',
        'item', format('%s (%s, %s)', variant.item_name, variant.color, variant.size),
        'available', available_quantity);
    end if;
  end loop;

  for variant in
    select
      i ->> 'slug' as product_slug,
      i ->> 'color' as color,
      i ->> 'size' as size,
      sum((i ->> 'qty')::integer)::integer as requested_quantity
    from jsonb_array_elements(p_sale -> 'items') as items(i)
    where coalesce(i ->> 'slug', '') <> ''
    group by i ->> 'slug', i ->> 'color', i ->> 'size'
    order by i ->> 'slug', i ->> 'color', i ->> 'size'
  loop
    update public.product_variant_inventory
      set quantity = quantity - variant.requested_quantity,
          updated_at = now()
      where product_slug = variant.product_slug
        and color = variant.color
        and size = variant.size;
  end loop;

  -- Random, non-sequential number with its own prefix so shop sales stand out.
  loop
    select 'SHOP-' || string_agg(substr(alphabet, 1 + (get_byte(b, n) % 32), 1), '' order by n)
      into v_order_number
      from (select uuid_send(gen_random_uuid()) as b) as r, generate_series(0, 7) as n;
    exit when not exists (select 1 from public.orders where orders.order_number = v_order_number);
  end loop;

  insert into public.orders (
    order_number,
    customer_name,
    phone,
    items,
    image_url,
    subtotal,
    delivery,
    total,
    payment_method,
    payment_status,
    notes,
    status,
    source,
    inventory_reserved_at,
    created_at
  )
  values (
    v_order_number,
    coalesce(nullif(trim(p_sale ->> 'customerName'), ''), 'Walk-in customer'),
    coalesce(trim(p_sale ->> 'phone'), ''),
    p_sale -> 'items',
    nullif(p_sale #>> '{items,0,image}', ''),
    v_subtotal,
    0,
    v_subtotal,
    v_payment_method,
    'paid',
    nullif(trim(p_sale ->> 'notes'), ''),
    'Delivered',
    'in_person',
    case when v_has_stock_items then now() else null end,
    v_sold_at
  );

  return jsonb_build_object('ok', true, 'orderNumber', v_order_number);
end;
$$;

revoke all on function public.record_in_person_sale(jsonb) from public, anon;
grant execute on function public.record_in_person_sale(jsonb) to authenticated;
