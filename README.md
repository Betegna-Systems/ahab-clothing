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
