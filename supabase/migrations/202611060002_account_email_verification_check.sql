-- Fix: Supabase access tokens carry no top-level `email_verified` claim (it exists only inside
-- the user-editable `user_metadata`), so the previous checks always failed and every customer
-- was refused saved addresses, wishlist sync, and the MFA opt-in. Verify against the
-- server-managed `auth.users.email_confirmed_at` instead; never trust `user_metadata`.
create or replace function public.account_email_is_confirmed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as users
    where users.id = auth.uid()
      and users.email_confirmed_at is not null
  );
$$;

create or replace function public.account_session_is_verified()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and public.account_email_is_confirmed()
    and (
      not public.account_mfa_is_required()
      or coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
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

  if not public.account_email_is_confirmed() then
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

revoke all on function public.account_email_is_confirmed() from public, anon;
grant execute on function public.account_email_is_confirmed() to authenticated;
revoke all on function public.account_session_is_verified() from public, anon;
grant execute on function public.account_session_is_verified() to authenticated;
revoke all on function public.set_account_mfa_required(boolean) from public, anon;
grant execute on function public.set_account_mfa_required(boolean) to authenticated;
