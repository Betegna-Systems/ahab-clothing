-- Messages sent from the website's Contact page.
--
-- Rows are written only by the server (service role) after validation and rate limiting;
-- admins with a verified (aal2) session can read them and mark them handled.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null default '' check (char_length(phone) <= 40),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

revoke all on public.contact_messages from anon, authenticated;
grant select, update on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_email_created_idx
  on public.contact_messages (email, created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_admin_read" on public.contact_messages;
create policy "contact_messages_admin_read"
  on public.contact_messages
  for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and auth.jwt() ->> 'aal' = 'aal2'
  );

drop policy if exists "contact_messages_admin_update" on public.contact_messages;
create policy "contact_messages_admin_update"
  on public.contact_messages
  for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and auth.jwt() ->> 'aal' = 'aal2'
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and auth.jwt() ->> 'aal' = 'aal2'
  );
