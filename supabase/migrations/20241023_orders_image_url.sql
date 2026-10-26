alter table public.orders
  add column if not exists image_url text;
