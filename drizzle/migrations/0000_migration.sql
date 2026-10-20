CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  sub_city text,
  city text,
  address text,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  delivery numeric NOT NULL,
  total numeric NOT NULL,
  payment_method text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;