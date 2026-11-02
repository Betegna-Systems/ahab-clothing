# AHAB Clothing

Modern Ethiopian fashion for everyday ritual, celebration, and self-expression.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Supabase storefront setup

Apply the SQL migrations in `supabase/migrations` before deploying order tracking, verified reviews,
or variant stock controls. Manage stock in `product_variant_inventory` using the exact product slug,
color name, and size; only positive quantities are available, and missing variants are blocked.
Enter AHAB's confirmed counts after applying the inventory migration—no quantities are seeded.

Customer accounts use Supabase email/password authentication. Apply
`supabase/migrations/202611020003_customer_accounts.sql` to enable private, per-account wishlists and
saved delivery addresses. In Supabase Auth settings, configure email verification and allow the
storefront's `/account` URL as a redirect destination. Order history is matched to the verified
account email; existing guest checkout remains available.

For Vercel deployments, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the
Production, Preview, and Development environments as needed. Server-side order, inventory, and
account-history features also require `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; keep the
service-role key server-only and never use a `VITE_` prefix for it. Redeploy after changing
environment variables.
