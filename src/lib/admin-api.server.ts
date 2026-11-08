import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { bearerToken, isVerifiedAdmin } from "@/lib/admin-api";

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/**
 * Verifies the admin app's Supabase session (same admin rule as the database policies).
 * Returns the admin's user id, or an error Response to send back as-is.
 */
export async function requireAdminRequest(
  request: Request,
): Promise<{ userId: string } | { response: Response }> {
  const token = bearerToken(request.headers.get("authorization"));
  if (!token) return { response: jsonResponse({ error: "unauthorized" }, 401) };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return { response: jsonResponse({ error: "unauthorized" }, 401) };
  if (!isVerifiedAdmin(data.user)) return { response: jsonResponse({ error: "forbidden" }, 403) };
  return { userId: data.user.id };
}
