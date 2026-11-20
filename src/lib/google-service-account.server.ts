// Firebase service-account helpers built on Web Crypto + fetch, so they run on Cloudflare
// Workers (which can't run firebase-admin's HTTP/2 transport) as well as in Node.

type ServiceAccount = { projectId: string; clientEmail: string; privateKey: string };

/**
 * A secret as pasted into a hosting dashboard: trims whitespace and one pair of wrapping quotes
 * (values copied straight from a .env line keep them), and turns literal "\n" into newlines.
 */
function readSecret(name: string) {
  const value = process.env[name]?.trim();
  if (!value) return undefined;
  const unquoted = /^(["']).*\1$/s.test(value) ? value.slice(1, -1) : value;
  return unquoted.replace(/\\n/g, "\n").trim() || undefined;
}

export function getServiceAccount(): ServiceAccount {
  const projectId = readSecret("FIREBASE_PROJECT_ID");
  const clientEmail = readSecret("FIREBASE_CLIENT_EMAIL");
  const privateKey = readSecret("FIREBASE_PRIVATE_KEY");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase service-account credentials are not configured.");
  }
  return { projectId, clientEmail, privateKey };
}

const encoder = new TextEncoder();

function base64Url(bytes: Uint8Array | string) {
  const data = typeof bytes === "string" ? encoder.encode(bytes) : bytes;
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

let cachedKey: { pem: string; key: Promise<CryptoKey> } | undefined;

function importPrivateKey(pem: string) {
  if (cachedKey?.pem === pem) return cachedKey.key;
  // Keep only the base64 body: drops the BEGIN/END lines and any stray quotes, spaces or
  // line breaks left over from pasting the key.
  const body = pem
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "")
    .replace(/[^A-Za-z0-9+/=]/g, "");
  const der = Uint8Array.from(atob(body), (character) => character.charCodeAt(0));
  const key = crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  cachedKey = { pem, key };
  return key;
}

/** RS256-signed JWT from the service account's private key. */
export async function signServiceAccountJwt(payload: Record<string, unknown>) {
  const { privateKey } = getServiceAccount();
  const unsigned = `${base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64Url(
    JSON.stringify(payload),
  )}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    await importPrivateKey(privateKey),
    encoder.encode(unsigned),
  );
  return `${unsigned}.${base64Url(new Uint8Array(signature))}`;
}

const AUTH_AUDIENCE =
  "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";

/** Firebase Auth custom token (what firebase-admin's createCustomToken produced). */
export async function createFirebaseCustomToken(uid: string, claims: Record<string, unknown>) {
  const { clientEmail } = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  return signServiceAccountJwt({
    iss: clientEmail,
    sub: clientEmail,
    aud: AUTH_AUDIENCE,
    iat: now,
    exp: now + 60 * 60,
    uid,
    claims,
  });
}

let cachedAccessToken: { scope: string; token: string; expiresAt: number } | undefined;

/** OAuth2 access token for Google APIs (e.g. FCM), cached until shortly before it expires. */
export async function getGoogleAccessToken(scope: string) {
  if (cachedAccessToken?.scope === scope && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }
  const { clientEmail } = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const assertion = await signServiceAccountJwt({
    iss: clientEmail,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Google token request returned HTTP ${response.status}.`);
  const result = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!result.access_token) throw new Error("Google token response had no access token.");
  cachedAccessToken = {
    scope,
    token: result.access_token,
    expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000,
  };
  return result.access_token;
}

export type FcmResult = "sent" | "unregistered" | "failed";

/** Sends one FCM v1 message; "unregistered" means the device token should be forgotten. */
export async function sendFcmMessage(
  token: string,
  notification: { title: string; body: string },
  data: Record<string, string>,
  options: { validateOnly?: boolean } = {},
): Promise<FcmResult> {
  const { projectId } = getServiceAccount();
  const accessToken = await getGoogleAccessToken(
    "https://www.googleapis.com/auth/firebase.messaging",
  );
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
      body: JSON.stringify({
        validate_only: options.validateOnly ?? false,
        message: { token, notification, data, android: { priority: "HIGH" } },
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (response.ok) return "sent";
  const text = await response.text();
  // UNREGISTERED: app removed. INVALID_ARGUMENT on the token: malformed/stale token.
  if (
    response.status === 404 ||
    text.includes("UNREGISTERED") ||
    (response.status === 400 && text.includes("registration token"))
  ) {
    return "unregistered";
  }
  console.error(`FCM send failed (HTTP ${response.status}):`, text.slice(0, 300));
  return "failed";
}
