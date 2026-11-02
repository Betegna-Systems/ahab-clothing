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
saved delivery addresses, then apply `supabase/migrations/202611020004_customer_auth_hardening.sql`
to require verified email for account data access and enable optional authenticator-based MFA.
In Supabase Auth settings, require email confirmation, configure the password policy, set appropriate
auth rate limits, configure CAPTCHA protection, and allow the storefront's `/account` URL as a redirect
destination. New passwords in the storefront must be at least 12 characters. Order history is matched
to the verified account email; existing guest checkout remains available.

Customers can optionally enable an authenticator app from **Account security**. Once enabled, the
sign-in page requires a valid authenticator code, and database row-level security also requires the
MFA-protected session for saved addresses, account wishlists, and order history. Enable TOTP under
Supabase Auth's MFA settings. Sign-out revokes all active sessions. Keep Supabase's email confirmation
enabled; the storefront also refuses to keep an unverified email session signed in.

If a customer loses their authenticator, support must verify their identity before an administrator
removes the factor in Supabase Auth and clears that user's `mfa_required` flag in
`account_security_settings`. Never disable MFA based only on an unauthenticated support request.

Supabase Auth rate limits and CAPTCHA are server-side protections and cannot be enforced by the
storefront alone. Configure them in the Supabase Dashboard under **Authentication**; use a supported
CAPTCHA provider and apply its site/secret keys only in the provider and Supabase settings, never in
source code. Configure leaked-password protection when available on your Supabase plan.

For Vercel deployments, configure `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for the Production,
Preview, and Development environments as needed. The server returns only these public auth values to
the browser at runtime; `SUPABASE_SERVICE_ROLE_KEY` remains server-only. The older `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` names remain supported. Redeploy after changing environment variables.
