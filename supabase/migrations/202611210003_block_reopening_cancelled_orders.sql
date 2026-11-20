-- Cancelling an order puts its reserved stock back on sale (release_cancelled_order_inventory)
-- and stamps inventory_released_at. Moving that order back to an active status would leave it
-- live with no stock held, so the same piece could be sold twice. Block it: once a cancelled
-- order's stock has been released, its status stays cancelled. Place a new order instead.
--
-- Safe to run more than once.

create or replace function public.prevent_reopening_released_order()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.inventory_released_at is not null
    and lower(trim(old.status)) in ('cancelled', 'canceled')
    and lower(trim(new.status)) not in ('cancelled', 'canceled')
  then
    raise exception 'Order % was cancelled and its stock returned, so it cannot be reopened. Place a new order instead.', old.order_number
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_reopening_released_order() from public, anon, authenticated;

drop trigger if exists prevent_reopening_released_order on public.orders;
create trigger prevent_reopening_released_order
  before update of status on public.orders
  for each row
  execute function public.prevent_reopening_released_order();
