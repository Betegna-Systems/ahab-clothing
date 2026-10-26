grant select, update on public.orders to anon, authenticated;

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read"
  on public.orders
  for select
  to anon, authenticated
  using (true);

drop policy if exists "orders_admin_update_status" on public.orders;
create policy "orders_admin_update_status"
  on public.orders
  for update
  to anon, authenticated
  using (true)
  with check (true);
