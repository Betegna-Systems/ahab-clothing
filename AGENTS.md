# Project notes

This repository contains the AHAB Clothing storefront and product experience.

- Keep the storefront branding aligned with AHAB.
- Do not reintroduce generated template metadata.
- Prefer clean, production-ready frontend changes that maintain the current design system.
- Pending feature migrations use the explicit FeatureDatabase contract and reuse managed clients; generated live-schema types remain untouched, and compilation does not imply migration deployment.
- Order pricing is authoritative on the server: `placeOrder` re-prices every line from the product catalog (Firestore, falling back to the static catalog) with the shared rules in `src/lib/order-pricing.ts`, and rejects mismatched browser totals as `price_changed`. Never save browser-supplied prices, delivery fees, or totals.
- Order access rules (ownership, receipt submission, review eligibility) live as pure functions in `src/lib/order-access.ts` and are covered by `npm test`. Keep runtime imports out of `order-pricing.ts` and `order-access.ts` so Node's test runner can load them without path aliases.
- Account order history is granted only by `orders.customer_user_id` (set at signed-in checkout or by `claimAccountOrder` with the order's private tracking token). Never grant access by matching email.
- Stock is reserved atomically by `place_order_with_inventory`; cancellation restocks once through `inventory_released_at`. Test against live data only with clearly labelled records and restore stock afterwards.
- `src/integrations/supabase/types.ts` is generated: it is excluded from ESLint and Prettier and must not be reformatted or edited.
