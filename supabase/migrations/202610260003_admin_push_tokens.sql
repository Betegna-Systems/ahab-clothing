create table if not exists public.admin_push_tokens (
  user_id uuid not null references auth.users(id) on delete cascade,
  token text primary key,
  platform text not null check (platform in ('android', 'ios')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_push_tokens_user_id_idx
  on public.admin_push_tokens(user_id);

alter table public.admin_push_tokens enable row level security;
revoke all on public.admin_push_tokens from anon;
grant select, insert, update, delete on public.admin_push_tokens to authenticated;
grant all on public.admin_push_tokens to service_role;

drop policy if exists "admin_push_tokens_admin_manage_own" on public.admin_push_tokens;
create policy "admin_push_tokens_admin_manage_own"
  on public.admin_push_tokens
  for all
  to authenticated
  using (
    user_id = auth.uid()
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    user_id = auth.uid()
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
