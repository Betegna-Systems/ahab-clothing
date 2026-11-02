create table if not exists public.custom_commissions (
  id uuid primary key default gen_random_uuid(),
  commission_type text not null check (commission_type in ('top', 'suit')),
  customer_name text not null check (char_length(btrim(customer_name)) between 1 and 200),
  phone text not null check (char_length(btrim(phone)) between 3 and 40),
  email text not null check (char_length(email) between 3 and 254),
  occasion text not null check (char_length(occasion) between 1 and 80),
  style text not null check (char_length(style) between 1 and 100),
  color text not null default '' check (char_length(color) <= 120),
  fabric text not null default '' check (char_length(fabric) <= 120),
  budget text not null check (char_length(budget) between 1 and 80),
  measurements jsonb not null default '{}'::jsonb,
  fit_preferences text not null default '' check (char_length(fit_preferences) <= 120),
  notes text not null default '' check (char_length(notes) <= 2000),
  privacy_consent_at timestamptz not null default now(),
  image_paths text[] not null default '{}',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'consultation', 'quoted', 'in_progress', 'completed', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(image_paths) <= 3)
);

create index if not exists custom_commissions_created_at_idx
  on public.custom_commissions (created_at desc);
create index if not exists custom_commissions_email_created_idx
  on public.custom_commissions (email, created_at desc);
create index if not exists custom_commissions_status_created_idx
  on public.custom_commissions (status, created_at desc);

alter table public.custom_commissions enable row level security;
revoke all on public.custom_commissions from anon, authenticated;
grant select, update on public.custom_commissions to authenticated;
grant all on public.custom_commissions to service_role;

drop policy if exists "custom_commissions_admin_read" on public.custom_commissions;
create policy "custom_commissions_admin_read"
  on public.custom_commissions
  for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and auth.jwt() ->> 'aal' = 'aal2'
  );

drop policy if exists "custom_commissions_admin_update" on public.custom_commissions;
create policy "custom_commissions_admin_update"
  on public.custom_commissions
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'custom-commission-inspiration',
  'custom-commission-inspiration',
  false,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "custom_commission_photos_admin_read" on storage.objects;
create policy "custom_commission_photos_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'custom-commission-inspiration'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and auth.jwt() ->> 'aal' = 'aal2'
  );
