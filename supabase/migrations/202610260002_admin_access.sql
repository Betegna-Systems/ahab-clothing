-- Restrict customer order data and payment receipts to authenticated admins.
-- After creating an Auth user, grant admin access from the SQL Editor:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
--     || jsonb_build_object('role', 'admin')
-- where email = 'YOUR_ADMIN_EMAIL';
-- The user must sign in again after this claim is set.
revoke select, update on public.orders from anon;
grant select, update on public.orders to authenticated;

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read"
  on public.orders
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "orders_admin_update_status" on public.orders;
create policy "orders_admin_update_status"
  on public.orders
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "payment_proofs_admin_read" on storage.objects;
create policy "payment_proofs_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
