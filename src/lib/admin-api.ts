// Pure rules for the admin-app API (/api/admin/*). Keep runtime imports out of this module so
// Node's test runner can load it without the app's path aliases.

/** Cloudinary folder the admin app uploads product photos into; fixed server-side. */
export const PRODUCT_UPLOAD_FOLDER = "ahab-clothing/products";

/** Store admins are Supabase users with a confirmed email and the server-set admin role. */
export function isVerifiedAdmin(
  user: { email_confirmed_at?: string | null; app_metadata?: Record<string, unknown> } | null,
) {
  return Boolean(user?.email_confirmed_at) && user?.app_metadata?.["role"] === "admin";
}

/** Extracts a Supabase access token from an `Authorization: Bearer …` header. */
export function bearerToken(header: string | null) {
  const match = /^Bearer\s+([A-Za-z0-9._-]{20,4096})$/.exec(header ?? "");
  return match ? match[1]! : null;
}

/** Cloudinary's string-to-sign: params sorted by name, joined as k=v with &, then the secret. */
export function cloudinarySignaturePayload(
  params: Record<string, string | number>,
  secret: string,
) {
  const joined = Object.keys(params)
    .filter((key) => params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return `${joined}${secret}`;
}

export async function cloudinarySignature(params: Record<string, string | number>, secret: string) {
  const digest = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(cloudinarySignaturePayload(params, secret)),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
