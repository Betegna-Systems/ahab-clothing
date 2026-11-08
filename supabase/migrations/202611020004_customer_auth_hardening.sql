create table if not exists public.account_security_settings (
  user_id uuid primary key,
  mfa_required boolean not null default false,
  updated_at timestamptz not null default now()
);

revoke all on public.account_security_settings from anon, authenticated;
grant all on public.account_security_settings to service_role;

alter table public.account_security_settings enable row level security;

create or replace function public.account_mfa_is_required()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select settings.mfa_required
      from public.account_security_settings as settings
      where settings.user_id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.set_account_mfa_required(p_required boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  requesting_user_id uuid := auth.uid();
begin
  if requesting_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (select 1 from auth.users where id = requesting_user_id and email_confirmed_at is not null) then
    raise exception 'A verified email address is required';
  end if;

  if (auth.jwt() ->> 'aal') is distinct from 'aal2' then
    raise exception 'A verified second factor is required';
  end if;

  insert into public.account_security_settings (user_id, mfa_required, updated_at)
  values (requesting_user_id, p_required, now())
  on conflict (user_id) do update
  set mfa_required = excluded.mfa_required,
      updated_at = excluded.updated_at;
end;
$$;

create or replace function public.account_session_is_verified()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (select 1 from auth.users where id = auth.uid() and email_confirmed_at is not null)
    and (
      not public.account_mfa_is_required()
      or auth.jwt() ->> 'aal' = 'aal2'
    );
$$;

revoke all on function public.account_mfa_is_required() from public, anon;
revoke all on function public.set_account_mfa_required(boolean) from public, anon;
revoke all on function public.account_session_is_verified() from public, anon;
grant execute on function public.account_mfa_is_required() to authenticated;
grant execute on function public.set_account_mfa_required(boolean) to authenticated;
grant execute on function public.account_session_is_verified() to authenticated;

drop policy if exists "account_wishlist_read_own" on public.account_wishlist;
create policy "account_wishlist_read_own"
  on public.account_wishlist
  for select
  to authenticated
  using (user_id = auth.uid() and public.account_session_is_verified());

drop policy if exists "account_wishlist_insert_own" on public.account_wishlist;
create policy "account_wishlist_insert_own"
  on public.account_wishlist
  for insert
  to authenticated
  with check (user_id = auth.uid() and public.account_session_is_verified());

drop policy if exists "account_wishlist_delete_own" on public.account_wishlist;
create policy "account_wishlist_delete_own"
  on public.account_wishlist
  for delete
  to authenticated
  using (user_id = auth.uid() and public.account_session_is_verified());

drop policy if exists "account_saved_addresses_read_own" on public.account_saved_addresses;
create policy "account_saved_addresses_read_own"
  on public.account_saved_addresses
  for select
  to authenticated
  using (user_id = auth.uid() and public.account_session_is_verified());

drop policy if exists "account_saved_addresses_insert_own" on public.account_saved_addresses;
create policy "account_saved_addresses_insert_own"
  on public.account_saved_addresses
  for insert
  to authenticated
  with check (user_id = auth.uid() and public.account_session_is_verified());

drop policy if exists "account_saved_addresses_update_own" on public.account_saved_addresses;
create policy "account_saved_addresses_update_own"
  on public.account_saved_addresses
  for update
  to authenticated
  using (user_id = auth.uid() and public.account_session_is_verified())
  with check (user_id = auth.uid() and public.account_session_is_verified());

drop policy if exists "account_saved_addresses_delete_own" on public.account_saved_addresses;
create policy "account_saved_addresses_delete_own"
  on public.account_saved_addresses
  for delete
  to authenticated
  using (user_id = auth.uid() and public.account_session_is_verified());
