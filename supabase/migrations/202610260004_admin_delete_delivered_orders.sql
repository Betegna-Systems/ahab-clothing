grant delete on public.orders to authenticated;

drop policy if exists "orders_admin_delete_delivered" on public.orders;
create policy "orders_admin_delete_delivered"
  on public.orders
  for delete
  to authenticated
  using (
    status = 'Delivered'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "payment_proofs_admin_delete" on storage.objects;
create policy "payment_proofs_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
