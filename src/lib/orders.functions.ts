import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MAX_CART_QUANTITY } from "@/lib/order-limits";
import { hasValidImageSignature } from "@/lib/image-validation";
import type { Json } from "@/integrations/supabase/types";

const line = z.object({
  slug: z.string().max(120),
  name: z.string().max(200),
  color: z.string().max(100),
  size: z.string().max(20),
  qty: z.number().int().min(1).max(MAX_CART_QUANTITY),
  price: z.number().min(0).max(1_000_000),
  image: z.string().max(2000),
});

const orderSchema = z.object({
  orderNumber: z.string().max(40),
  paymentAccessToken: z.string().uuid(),
  createdAt: z.string().max(40),
  customer: z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().max(200),
    phone: z.string().trim().min(3).max(40),
    address: z.string().max(500),
    subCity: z.string().max(100),
    city: z.string().max(100),
  }),
  items: z.array(line).min(1).max(50),
  subtotal: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().min(0),
  paymentMethod: z.enum(["Cash on delivery", "Telebirr", "CBE bank transfer"]),
  notes: z.string().max(1000),
});

const orderResultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true) }),
  z.object({
    ok: z.literal(false),
    reason: z.enum(["unavailable", "insufficient_stock", "failed"]),
  }),
]);

export const placeOrder = createServerFn({ method: "POST" })
  .validator((d: unknown) => orderSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { paymentAccessToken, ...order } = data;
    const { data: result, error } = await supabaseAdmin.rpc("place_order_with_inventory", {
      p_order: {
        ...order,
        paymentAccessTokenHash: await hashPaymentToken(paymentAccessToken),
      },
    });
    if (error) {
      console.error("Order reservation failed:", error.message);
      return { ok: false as const, reason: "failed" as const };
    }

    const outcome = orderResultSchema.parse(result);
    if (!outcome.ok) return outcome;

    const { notifyAdminsOfNewOrder } = await import("@/lib/admin-notifications.server");
    await notifyAdminsOfNewOrder({
      orderNumber: data.orderNumber,
      total: data.total,
      paymentMethod: data.paymentMethod,
      customerName: data.customer.name,
      customerPhone: data.customer.phone,
    });

    return { ok: true as const };
  });

const orderNumberSchema = z.string().regex(/^AHAB-[A-Z0-9]{4,12}$/);

async function hashPaymentToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const paymentAccessSchema = z.object({
  orderNumber: orderNumberSchema,
  token: z.string().uuid(),
});

export const getTrackedOrder = createServerFn({ method: "GET" })
  .validator((d: unknown) => paymentAccessSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tokenHash = await hashPaymentToken(data.token);
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, created_at, payment_status, items, payment_access_token_hash")
      .eq("order_number", data.orderNumber)
      .maybeSingle();

    if (error || !order || order.payment_access_token_hash !== tokenHash) return null;

    const reviewedProducts = await supabaseAdmin
      .from("customer_reviews")
      .select("product_slug")
      .eq("order_number", order.order_number);
    if (reviewedProducts.error) throw reviewedProducts.error;

    return {
      orderNumber: order.order_number,
      status: order.status,
      createdAt: order.created_at,
      paymentStatus: order.payment_status,
      items: orderItemsForTracking(order.items),
      reviewedProductSlugs: (reviewedProducts.data ?? []).map((review) => review.product_slug),
    };
  });

const accountOrdersSchema = z.object({
  accessToken: z.string().min(1).max(4096),
});

export const getAccountOrders = createServerFn({ method: "GET" })
  .validator((d: unknown) => accountOrdersSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claimsData, error: claimsError } = await supabaseAdmin.auth.getClaims(
      data.accessToken,
    );
    const userId = claimsData?.claims?.sub;
    if (claimsError || typeof userId !== "string") {
      return { ok: false as const, reason: "email_not_verified" as const };
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(data.accessToken);
    const user = authData.user;

    if (authError || !user?.email || !user.email_confirmed_at) {
      return { ok: false as const, reason: "email_not_verified" as const };
    }

    const { data: securitySettings, error: securityError } = await supabaseAdmin
      .from("account_security_settings")
      .select("mfa_required")
      .eq("user_id", userId)
      .maybeSingle();
    if (securityError) {
      console.error("Customer account security lookup failed:", securityError.message);
      throw new Error("Order history is temporarily unavailable.");
    }
    if (securitySettings?.mfa_required && claimsData?.claims?.aal !== "aal2") {
      return { ok: false as const, reason: "mfa_required" as const };
    }

    const emailPattern = user.email.replace(/[\\%_*]/g, "\\$&");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, payment_status, created_at, total, items")
      .ilike("email", emailPattern)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Customer order history lookup failed:", error.message);
      throw new Error("Order history is temporarily unavailable.");
    }

    return {
      ok: true as const,
      orders: (orders ?? []).map((order) => ({
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        total: order.total,
        items: orderItemsForTracking(order.items),
      })),
    };
  });

function orderItemsForTracking(items: Json): { slug: string; name: string }[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const slug = item["slug"];
    const name = item["name"];
    return typeof slug === "string" && typeof name === "string" ? [{ slug, name }] : [];
  });
}

const reviewSchema = paymentAccessSchema
  .extend({
    productSlug: z.string().regex(/^[a-z0-9-]{1,120}$/),
    reviewerName: z.string().trim().min(1).max(80),
    rating: z.number().int().min(1).max(5),
    fitFeedback: z.string().trim().max(500),
    reviewText: z.string().trim().min(10).max(1200),
    photoMimeType: z.enum(["image/jpeg", "image/png", "image/webp"]).optional(),
    photoBase64: z.string().max(4_200_000).optional(),
  })
  .superRefine((review, context) => {
    if (Boolean(review.photoMimeType) !== Boolean(review.photoBase64)) {
      context.addIssue({
        code: "custom",
        path: ["photoBase64"],
        message: "A photo type and photo file must be provided together.",
      });
    }
  });

export const submitVerifiedReview = createServerFn({ method: "POST" })
  .validator((data: unknown) => reviewSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tokenHash = await hashPaymentToken(data.token);
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, items, payment_access_token_hash")
      .eq("order_number", data.orderNumber)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order || order.payment_access_token_hash !== tokenHash) {
      return { ok: false as const, reason: "order_not_found" as const };
    }
    if (order.status.trim().toLowerCase() !== "delivered") {
      return { ok: false as const, reason: "not_delivered" as const };
    }
    if (!orderItemsForTracking(order.items).some((item) => item.slug === data.productSlug)) {
      return { ok: false as const, reason: "product_not_ordered" as const };
    }

    let photoPath: string | null = null;
    if (data.photoMimeType && data.photoBase64) {
      let bytes: Uint8Array;
      try {
        const binary = atob(data.photoBase64);
        bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      } catch {
        return { ok: false as const, reason: "invalid_photo" as const };
      }

      if (bytes.length > 3 * 1024 * 1024 || !hasValidImageSignature(bytes, data.photoMimeType)) {
        return { ok: false as const, reason: "invalid_photo" as const };
      }

      const extension =
        data.photoMimeType === "image/jpeg"
          ? "jpg"
          : data.photoMimeType === "image/png"
            ? "png"
            : "webp";
      photoPath = `${order.order_number}/${data.productSlug}/${crypto.randomUUID()}.${extension}`;
      const photoBuffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(photoBuffer).set(bytes);
      const { error: uploadError } = await supabaseAdmin.storage
        .from("customer-review-photos")
        .upload(photoPath, new Blob([photoBuffer], { type: data.photoMimeType }), {
          contentType: data.photoMimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error("Customer review photo upload failed:", uploadError.message);
        return { ok: false as const, reason: "photo_upload_failed" as const };
      }
    }

    const { error: reviewError } = await supabaseAdmin.from("customer_reviews").insert({
      order_number: order.order_number,
      product_slug: data.productSlug,
      reviewer_name: data.reviewerName,
      rating: data.rating,
      fit_feedback: data.fitFeedback,
      review_text: data.reviewText,
      photo_path: photoPath,
      status: "pending",
    });

    if (reviewError) {
      if (photoPath) {
        const { error: removeError } = await supabaseAdmin.storage
          .from("customer-review-photos")
          .remove([photoPath]);
        if (removeError) {
          console.error("Could not remove unsubmitted customer review photo:", removeError.message);
        }
      }
      if (reviewError.code === "23505") {
        return { ok: false as const, reason: "already_submitted" as const };
      }
      console.error("Customer review submission failed:", reviewError.message);
      return { ok: false as const, reason: "save_failed" as const };
    }

    return { ok: true as const };
  });

export const getApprovedProductReviews = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ productSlug: z.string().max(120) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: reviews, error } = await supabaseAdmin
      .from("customer_reviews")
      .select("reviewer_name, rating, fit_feedback, review_text, photo_path, created_at")
      .eq("product_slug", data.productSlug)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Promise.all(
      (reviews ?? []).map(async (review) => {
        if (!review.photo_path) {
          return {
            reviewerName: review.reviewer_name,
            rating: review.rating,
            fitFeedback: review.fit_feedback,
            reviewText: review.review_text,
            photoUrl: null,
            createdAt: review.created_at,
          };
        }

        const { data: photo, error: photoError } = await supabaseAdmin.storage
          .from("customer-review-photos")
          .createSignedUrl(review.photo_path, 60 * 60);
        if (photoError) throw photoError;

        return {
          reviewerName: review.reviewer_name,
          rating: review.rating,
          fitFeedback: review.fit_feedback,
          reviewText: review.review_text,
          photoUrl: photo.signedUrl,
          createdAt: review.created_at,
        };
      }),
    );
  });

export const getPaymentOrder = createServerFn({ method: "GET" })
  .validator((d: unknown) => paymentAccessSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tokenHash = await hashPaymentToken(data.token);
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, total, payment_method, payment_status, payment_submitted_at, payment_access_token_hash",
      )
      .eq("order_number", data.orderNumber)
      .maybeSingle();

    if (error || !order || order.payment_access_token_hash !== tokenHash) return null;
    if (!["Telebirr", "CBE bank transfer"].includes(order.payment_method)) return null;

    return {
      orderNumber: order.order_number,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      paymentSubmittedAt: order.payment_submitted_at,
    };
  });

const proofSchema = paymentAccessSchema.extend({
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  imageBase64: z.string().min(1).max(7_000_000),
});

export const submitPaymentProof = createServerFn({ method: "POST" })
  .validator((d: unknown) => proofSchema.parse(d))
  .handler(async ({ data }) => {
    let bytes: Uint8Array;
    try {
      const binary = atob(data.imageBase64);
      bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    } catch {
      return { ok: false as const, reason: "invalid_image" as const };
    }

    if (bytes.length > 5 * 1024 * 1024 || !hasValidImageSignature(bytes, data.mimeType)) {
      return { ok: false as const, reason: "invalid_image" as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tokenHash = await hashPaymentToken(data.token);
    const { data: order, error: lookupError } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, total, customer_name, phone, payment_method, payment_status, payment_access_token_hash",
      )
      .eq("order_number", data.orderNumber)
      .maybeSingle();

    if (
      lookupError ||
      !order ||
      order.payment_access_token_hash !== tokenHash ||
      !["Telebirr", "CBE bank transfer"].includes(order.payment_method)
    ) {
      return { ok: false as const, reason: "order_not_found" as const };
    }
    if (order.payment_status !== "pending") {
      return { ok: false as const, reason: "already_submitted" as const };
    }

    const extension =
      data.mimeType === "image/jpeg" ? "jpg" : data.mimeType === "image/png" ? "png" : "webp";
    const path = `${order.order_number}/receipt.${extension}`;
    const imageBuffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(imageBuffer).set(bytes);
    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment-proofs")
      .upload(path, new Blob([imageBuffer], { type: data.mimeType }), {
        contentType: data.mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Payment receipt upload failed:", uploadError.message);
      return { ok: false as const, reason: "upload_failed" as const };
    }

    const submittedAt = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "receipt_submitted",
        payment_proof_path: path,
        payment_submitted_at: submittedAt,
      })
      .eq("order_number", data.orderNumber)
      .eq("payment_access_token_hash", tokenHash);

    if (updateError) {
      await supabaseAdmin.storage.from("payment-proofs").remove([path]);
      console.error("Payment receipt status update failed:", updateError.message);
      return { ok: false as const, reason: "save_failed" as const };
    }

    const { notifyAdminsOfPaymentReceiptSubmission } =
      await import("@/lib/admin-notifications.server");
    await notifyAdminsOfPaymentReceiptSubmission({
      orderNumber: order.order_number,
      total: order.total,
      paymentMethod: order.payment_method,
      customerName: order.customer_name,
      customerPhone: order.phone,
    });

    return { ok: true as const, submittedAt };
  });
