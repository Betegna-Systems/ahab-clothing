-- Link orders to customer accounts explicitly. Order history must never be granted by a
-- matching email alone; guest orders are linked only through the private tracking link
-- (claimAccountOrder) or automatically when a signed-in customer checks out.
alter table public.orders
  add column if not exists customer_user_id uuid references auth.users (id) on delete set null;

create index if not exists orders_customer_user_id_idx
  on public.orders (customer_user_id, created_at desc)
  where customer_user_id is not null;

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
    customer_user_id,
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
