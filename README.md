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

Custom commission requests are saved to Supabase by applying
`supabase/migrations/202611020005_custom_commissions.sql`. This creates the requests table and a
private inspiration-image bucket. Customers can upload up to three private images per request;
requests are rate-limited per email. Admins can review and update requests at
`/admin/custom-orders`. Grant the trusted admin Auth user the `role: admin` app-metadata claim using
the instructions in `supabase/migrations/202610260002_admin_access.sql`; only that claim grants
access. Admin access to custom requests and private images also requires an AAL2 session, so set up
an authenticator factor for each admin user. New requests use the configured Telegram alerts and
admin push notifications.

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

## Hosting (Cloudflare Workers)

The site runs on Cloudflare Workers as the `ahab-tailored` Worker (settings in `wrangler.jsonc`) and is
served at https://www.ahabtailored.com; the bare `ahabtailored.com` redirects there (`src/server.ts`).
Cloudflare's GitHub integration builds every push to `main` with `npm run build` and deploys with
`npx wrangler deploy --config .output/server/wrangler.json`.

- **Build variables** (Settings → Build → Variables): every `VITE_*` value, e.g. `VITE_SITE_URL`,
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`. They are baked into the
  bundle at build time, so redeploy after changing them.
- **Runtime secrets** (Settings → Variables and Secrets, type _Secret_): `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CLOUDINARY_*`, and `RESEND_API_KEY` / `ORDER_EMAIL_FROM`
  for order emails. The server returns only the public Supabase URL and anon key to the browser;
  `SUPABASE_SERVICE_ROLE_KEY` stays server-only.

To try the Workers build locally: `npm run build`, then
`npx wrangler dev --config .output/server/wrangler.json --env-file <absolute path to .env>`.
