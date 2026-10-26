create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  sub_city text,
  city text,
  address text,
  items jsonb not null,
  subtotal numeric not null,
  delivery numeric not null,
  total numeric not null,
  payment_method text not null,
  notes text,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

grant all on public.orders to service_role;
revoke all on public.orders from anon, authenticated;
