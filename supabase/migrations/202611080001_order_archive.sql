-- Archive instead of delete: the admin app hides archived orders from its active order
-- list, while they stay in sales figures, in the customer's account history and on
-- their private tracking link. Existing admin RLS update policies already cover this
-- column (table-level update grant + admin-only policy), so no policy changes are needed.
alter table public.orders
  add column if not exists archived_at timestamptz;

comment on column public.orders.archived_at is
  'Set when an admin archives the order; null for active orders. Archived orders still count in sales.';

-- The admin order list reads active orders newest first.
create index if not exists orders_active_created_at_idx
  on public.orders (created_at desc)
  where archived_at is null;
