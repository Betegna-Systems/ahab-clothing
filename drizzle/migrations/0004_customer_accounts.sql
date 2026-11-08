create table if not exists public.account_wishlist (
  user_id uuid not null,
  product_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

revoke all on public.account_wishlist from anon, authenticated;
grant select, insert, delete on public.account_wishlist to authenticated;
grant all on public.account_wishlist to service_role;

alter table public.account_wishlist enable row level security;

drop policy if exists "account_wishlist_read_own" on public.account_wishlist;
create policy "account_wishlist_read_own"
  on public.account_wishlist
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "account_wishlist_insert_own" on public.account_wishlist;
create policy "account_wishlist_insert_own"
  on public.account_wishlist
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "account_wishlist_delete_own" on public.account_wishlist;
create policy "account_wishlist_delete_own"
  on public.account_wishlist
  for delete
  to authenticated
  using (user_id = auth.uid());

create table if not exists public.account_saved_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  label text not null check (char_length(btrim(label)) between 1 and 60),
  recipient_name text not null check (char_length(btrim(recipient_name)) between 1 and 200),
  phone text not null check (char_length(btrim(phone)) between 1 and 40),
  sub_city text not null check (char_length(btrim(sub_city)) between 1 and 100),
  city text not null check (char_length(btrim(city)) between 1 and 100),
  address text not null check (char_length(btrim(address)) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

revoke all on public.account_saved_addresses from anon, authenticated;
grant select, insert, update, delete on public.account_saved_addresses to authenticated;
grant all on public.account_saved_addresses to service_role;

create index if not exists account_saved_addresses_user_created_idx
  on public.account_saved_addresses (user_id, created_at desc);

alter table public.account_saved_addresses enable row level security;

drop policy if exists "account_saved_addresses_read_own" on public.account_saved_addresses;
create policy "account_saved_addresses_read_own"
  on public.account_saved_addresses
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "account_saved_addresses_insert_own" on public.account_saved_addresses;
create policy "account_saved_addresses_insert_own"
  on public.account_saved_addresses
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "account_saved_addresses_update_own" on public.account_saved_addresses;
create policy "account_saved_addresses_update_own"
  on public.account_saved_addresses
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "account_saved_addresses_delete_own" on public.account_saved_addresses;
create policy "account_saved_addresses_delete_own"
  on public.account_saved_addresses
  for delete
  to authenticated
  using (user_id = auth.uid());
