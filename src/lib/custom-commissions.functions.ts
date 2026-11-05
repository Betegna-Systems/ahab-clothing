import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { hasValidImageSignature } from "@/lib/image-validation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FeatureDatabase } from "@/lib/feature-database";

async function getFeatureAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient<FeatureDatabase>;
}

const imageSchema = z.object({
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  imageBase64: z.string().min(1).max(700_000),
});

const measurementNames = [
  "bust",
  "waist",
  "hips",
  "height",
  "shoulder_width",
  "sleeve_length",
  "jacket_length",
  "trouser_waist",
  "trouser_inseam",
] as const;

const commissionSchema = z
  .object({
    commissionType: z.enum(["top", "suit"]),
    customerName: z.string().trim().min(1).max(200),
    phone: z.string().trim().min(3).max(40),
    email: z.string().trim().email().max(254),
    occasion: z.string().trim().min(1).max(80),
    style: z.string().trim().min(1).max(100),
    color: z.string().trim().max(120),
    fabric: z.string().trim().max(120),
    budget: z.string().trim().min(1).max(80),
    measurements: z.record(z.string(), z.string().trim().max(20)),
    fitPreferences: z.string().trim().max(120),
    notes: z.string().trim().max(2000),
    privacyConsent: z.literal(true),
    images: z.array(imageSchema).max(3),
  })
  .superRefine((request, context) => {
    for (const name of Object.keys(request.measurements)) {
      if (!measurementNames.includes(name as (typeof measurementNames)[number])) {
        context.addIssue({
          code: "custom",
          path: ["measurements", name],
          message: "Unsupported measurement field.",
        });
      }
    }

    if (request.images.reduce((total, image) => total + image.imageBase64.length, 0) > 2_100_000) {
      context.addIssue({
        code: "custom",
        path: ["images"],
        message: "Inspiration images exceed the total upload limit.",
      });
    }
  });

const adminTokenSchema = z.object({
  accessToken: z.string().min(1).max(4096),
});

const commissionStatuses = [
  "new",
  "contacted",
  "consultation",
  "quoted",
  "in_progress",
  "completed",
  "declined",
] as const;

const updateStatusSchema = adminTokenSchema.extend({
  commissionId: z.string().uuid(),
  status: z.enum(commissionStatuses),
});

async function requireAdmin(accessToken: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
  return data.user;
}

function decodeImage(image: z.infer<typeof imageSchema>) {
  const binary = atob(image.imageBase64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  if (bytes.length > 512 * 1024 || !hasValidImageSignature(bytes, image.mimeType)) {
    throw new Error("Invalid inspiration image.");
  }
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: image.mimeType });
}

function imageExtension(mimeType: z.infer<typeof imageSchema>["mimeType"]) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  return "webp";
}

export const submitCustomCommission = createServerFn({ method: "POST" })
  .validator((data: unknown) => commissionSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentRequests, error: rateLimitError } = await supabaseAdmin
      .from("custom_commissions")
      .select("id")
      .eq("email", email)
      .gte("created_at", since)
      .limit(3);
    if (rateLimitError) {
      console.error("Custom commission rate-limit check failed:", rateLimitError.message);
      throw new Error("We couldn't submit your request. Please try again later.");
    }
    if ((recentRequests?.length ?? 0) >= 3) {
      return { ok: false as const, reason: "rate_limited" as const };
    }

    for (const [name, value] of Object.entries(data.measurements)) {
      if (value && !/^\d{1,3}(?:\.\d{1,2})?$/.test(value)) {
        return { ok: false as const, reason: "invalid_measurements" as const };
      }
      if (!measurementNames.includes(name as (typeof measurementNames)[number])) {
        return { ok: false as const, reason: "invalid_measurements" as const };
      }
    }

    const imagePaths = data.images.map((image, index) => {
      const extension = imageExtension(image.mimeType);
      return `commissions/${crypto.randomUUID()}/${index + 1}.${extension}`;
    });

    const { data: commission, error: insertError } = await supabaseAdmin
      .from("custom_commissions")
      .insert({
        commission_type: data.commissionType,
        customer_name: data.customerName,
        phone: data.phone,
        email,
        occasion: data.occasion,
        style: data.style,
        color: data.color,
        fabric: data.fabric,
        budget: data.budget,
        measurements: data.measurements,
        fit_preferences: data.fitPreferences,
        notes: data.notes,
        privacy_consent_at: new Date().toISOString(),
        image_paths: [],
        status: "new",
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Custom commission save failed:", insertError.message);
      return { ok: false as const, reason: "save_failed" as const };
    }

    const uploadedPaths: string[] = [];
    for (const [index, image] of data.images.entries()) {
      let blob: Blob;
      try {
        blob = decodeImage(image);
      } catch {
        if (uploadedPaths.length) {
          const { error: cleanupError } = await supabaseAdmin.storage
            .from("custom-commission-inspiration")
            .remove(uploadedPaths);
          if (cleanupError) {
            console.error("Custom commission image cleanup failed:", cleanupError.message);
          }
        }
        const { error: deleteError } = await supabaseAdmin
          .from("custom_commissions")
          .delete()
          .eq("id", commission.id);
        if (deleteError) {
          console.error("Invalid custom commission cleanup failed:", deleteError.message);
        }
        return { ok: false as const, reason: "invalid_image" as const };
      }

      const path = imagePaths[index];
      if (!path) continue;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("custom-commission-inspiration")
        .upload(path, blob, { contentType: image.mimeType, upsert: false });
      if (uploadError) {
        console.error("Custom commission inspiration upload failed:", uploadError.message);
        const { error: cleanupError } = await supabaseAdmin.storage
          .from("custom-commission-inspiration")
          .remove(uploadedPaths);
        if (cleanupError) {
          console.error("Custom commission image cleanup failed:", cleanupError.message);
        }
        const { error: deleteError } = await supabaseAdmin
          .from("custom_commissions")
          .delete()
          .eq("id", commission.id);
        if (deleteError) {
          console.error("Incomplete custom commission cleanup failed:", deleteError.message);
        }
        return { ok: false as const, reason: "upload_failed" as const };
      }
      uploadedPaths.push(path);
    }

    const { error: updateError } = await supabaseAdmin
      .from("custom_commissions")
      .update({ image_paths: uploadedPaths, updated_at: new Date().toISOString() })
      .eq("id", commission.id);
    if (updateError) {
      console.error("Custom commission image metadata save failed:", updateError.message);
      if (uploadedPaths.length) {
        const { error: cleanupError } = await supabaseAdmin.storage
          .from("custom-commission-inspiration")
          .remove(uploadedPaths);
        if (cleanupError) {
          console.error("Custom commission image cleanup failed:", cleanupError.message);
        }
      }
      const { error: deleteError } = await supabaseAdmin
        .from("custom_commissions")
        .delete()
        .eq("id", commission.id);
      if (deleteError) {
        console.error("Incomplete custom commission cleanup failed:", deleteError.message);
      }
      return { ok: false as const, reason: "save_failed" as const };
    }

    try {
      const { notifyAdminsOfNewCustomCommission } =
        await import("@/lib/admin-notifications.server");
      await notifyAdminsOfNewCustomCommission({
        commissionId: commission.id,
        commissionType: data.commissionType,
        customerName: data.customerName,
        customerPhone: data.phone,
      });
    } catch (error) {
      console.error("Custom commission notification could not be sent:", error);
    }

    return { ok: true as const, id: commission.id, createdAt: commission.created_at };
  });

export const getAdminCustomCommissions = createServerFn({ method: "GET" })
  .validator((data: unknown) => adminTokenSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: commissions, error } = await supabaseAdmin
      .from("custom_commissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("Admin custom commission lookup failed:", error.message);
      throw new Error("Custom requests are temporarily unavailable.");
    }

    const requests = await Promise.all(
      commissions.map(async (commission) => {
        const imageUrls = await Promise.all(
          commission.image_paths.map(async (path) => {
            const { data: signedImage, error: imageError } = await supabaseAdmin.storage
              .from("custom-commission-inspiration")
              .createSignedUrl(path, 60 * 60);
            if (imageError) {
              console.error("Custom commission image link creation failed:", imageError.message);
              return null;
            }
            return signedImage.signedUrl;
          }),
        );
        return {
          ...commission,
          imageUrls: imageUrls.filter((url): url is string => url !== null),
        };
      }),
    );
    return requests;
  });

export const updateAdminCustomCommissionStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => updateStatusSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("custom_commissions")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.commissionId);
    if (error) {
      console.error("Admin custom commission status update failed:", error.message);
      throw new Error("The request status couldn't be updated.");
    }
    return { ok: true as const };
  });
