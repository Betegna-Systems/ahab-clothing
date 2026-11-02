create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  order_number text not null references public.orders(order_number) on delete cascade,
  product_slug text not null,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  fit_feedback text not null,
  review_text text not null,
  photo_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (order_number, product_slug)
);

alter table public.customer_reviews enable row level security;
revoke all on public.customer_reviews from anon, authenticated;
grant all on public.customer_reviews to service_role;
grant select, update on public.customer_reviews to authenticated;

drop policy if exists "customer_reviews_admin_read" on public.customer_reviews;
create policy "customer_reviews_admin_read"
  on public.customer_reviews
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "customer_reviews_admin_update" on public.customer_reviews;
create policy "customer_reviews_admin_update"
  on public.customer_reviews
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'customer-review-photos',
  'customer-review-photos',
  false,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "customer_review_photos_admin_read" on storage.objects;
create policy "customer_review_photos_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'customer-review-photos'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
