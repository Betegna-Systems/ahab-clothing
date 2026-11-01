alter table public.orders
  add column if not exists image_url text,
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_proof_path text,
  add column if not exists payment_submitted_at timestamptz,
  add column if not exists payment_access_token_hash text;
update public.orders set payment_status = 'not_required' where lower(payment_method) = 'cash on delivery';
create unique index if not exists orders_payment_access_token_hash_idx on public.orders (payment_access_token_hash) where payment_access_token_hash is not null;

grant select, update, delete on public.orders to authenticated;
drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read" on public.orders for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "orders_admin_update_status" on public.orders;
create policy "orders_admin_update_status" on public.orders for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "orders_admin_delete_delivered" on public.orders;
create policy "orders_admin_delete_delivered" on public.orders for delete to authenticated using (status = 'Delivered' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.admin_push_tokens (
  user_id uuid not null,
  token text primary key,
  platform text not null check (platform in ('android', 'ios')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists admin_push_tokens_user_id_idx on public.admin_push_tokens(user_id);
grant select, insert, update, delete on public.admin_push_tokens to authenticated;
grant all on public.admin_push_tokens to service_role;
alter table public.admin_push_tokens enable row level security;
drop policy if exists "admin_push_tokens_admin_manage_own" on public.admin_push_tokens;
create policy "admin_push_tokens_admin_manage_own" on public.admin_push_tokens for all to authenticated
  using (user_id = auth.uid() and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (user_id = auth.uid() and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');