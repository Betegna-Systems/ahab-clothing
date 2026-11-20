import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FeatureDatabase } from "@/lib/feature-database";

async function getFeatureAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient<FeatureDatabase>;
}

/** Messages one IP may send per hour. */
const MAX_MESSAGES_PER_IP_PER_HOUR = 5;
/** Messages one email address may send per hour. */
const MAX_MESSAGES_PER_EMAIL_PER_HOUR = 3;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40),
  message: z.string().trim().min(1).max(2000),
  // Hidden field that real visitors never see; bots that fill every input get silently dropped.
  website: z.string().max(200).optional(),
});

export const CONTACT_MESSAGE_STATUSES = ["new", "replied", "closed"] as const;

const adminTokenSchema = z.object({
  accessToken: z.string().min(1).max(4096),
});

const updateStatusSchema = adminTokenSchema.extend({
  messageId: z.string().uuid(),
  status: z.enum(CONTACT_MESSAGE_STATUSES),
});

/** Same bar as the other admin screens: confirmed email, admin role, and a verified (aal2) session. */
async function requireAdmin(accessToken: string) {
  const supabaseAdmin = await getFeatureAdmin();
  const [{ data, error }, { data: claimsData, error: claimsError }] = await Promise.all([
    supabaseAdmin.auth.getUser(accessToken),
    supabaseAdmin.auth.getClaims(accessToken),
  ]);
  if (
    error ||
    claimsError ||
    claimsData?.claims?.aal !== "aal2" ||
    !data.user?.email_confirmed_at ||
    data.user.app_metadata?.role !== "admin"
  ) {
    throw new Error("Administrator authorization required.");
  }
}

/**
 * The caller's IP. Cloudflare sets cf-connecting-ip itself (a client can't forge it); on Vercel,
 * x-real-ip / x-forwarded-for are overwritten by the platform. Used only to key rate limits.
 */
async function requestIp() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const forwarded =
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-real-ip") ??
    getRequestHeader("x-forwarded-for") ??
    "";
  return forwarded.split(",")[0]!.trim() || "unknown";
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };

    const supabaseAdmin = await getFeatureAdmin();

    // Fails open if take_rate_limit isn't deployed, matching checkout; the email limit below still applies.
    const { data: allowed, error: ipLimitError } = await supabaseAdmin.rpc("take_rate_limit", {
      p_bucket: "contact",
      p_key_hash: await sha256(`contact:${await requestIp()}`),
      p_limit: MAX_MESSAGES_PER_IP_PER_HOUR,
      p_window_seconds: 60 * 60,
    });
    if (ipLimitError) console.error("Rate limit check (contact) failed:", ipLimitError.message);
    if (allowed === false) return { ok: false as const, reason: "rate_limited" as const };

    const email = data.email.toLowerCase();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await supabaseAdmin
      .from("contact_messages")
      .select("id")
      .eq("email", email)
      .gte("created_at", since)
      .limit(MAX_MESSAGES_PER_EMAIL_PER_HOUR);
    if (recentError) {
      console.error("Contact message rate-limit check failed:", recentError.message);
      return { ok: false as const, reason: "failed" as const };
    }
    if ((recent?.length ?? 0) >= MAX_MESSAGES_PER_EMAIL_PER_HOUR) {
      return { ok: false as const, reason: "rate_limited" as const };
    }

    const { error: insertError } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email,
      phone: data.phone,
      message: data.message,
    });
    if (insertError) {
      console.error("Contact message save failed:", insertError.message);
      return { ok: false as const, reason: "failed" as const };
    }

    try {
      const { notifyAdminsOfContactMessage } = await import("@/lib/admin-notifications.server");
      await notifyAdminsOfContactMessage({
        name: data.name,
        email,
        phone: data.phone,
        message: data.message,
      });
    } catch (error) {
      console.error("Contact message notification could not be sent:", error);
    }

    return { ok: true as const };
  });

// POST so the admin's access token never appears in a URL (and so in request logs).
export const getAdminContactMessages = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminTokenSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const supabaseAdmin = await getFeatureAdmin();
    const { data: messages, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) {
      console.error("Admin contact message lookup failed:", error.message);
      throw new Error("Messages are temporarily unavailable.");
    }
    return messages;
  });

export const updateAdminContactMessageStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => updateStatusSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const supabaseAdmin = await getFeatureAdmin();
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.messageId);
    if (error) {
      console.error("Admin contact message status update failed:", error.message);
      throw new Error("The message status couldn't be updated.");
    }
    return { ok: true as const };
  });
