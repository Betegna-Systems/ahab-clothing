alter table public.orders
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_proof_path text,
  add column if not exists payment_submitted_at timestamptz,
  add column if not exists payment_access_token_hash text;

update public.orders
set payment_status = 'not_required'
where lower(payment_method) = 'cash on delivery';

create unique index if not exists orders_payment_access_token_hash_idx
  on public.orders (payment_access_token_hash)
  where payment_access_token_hash is not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
