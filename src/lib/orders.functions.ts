import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MAX_CART_QUANTITY } from "@/lib/order-limits";

const line = z.object({
  name: z.string().max(200),
  color: z.string().max(100),
  size: z.string().max(20),
  qty: z.number().int().min(1).max(MAX_CART_QUANTITY),
  price: z.number().min(0).max(1_000_000),
  image: z.string().max(2000),
});

const orderSchema = z.object({
  orderNumber: z.string().max(40),
  paymentAccessToken: z.string().uuid().optional(),
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
}).superRefine((order, context) => {
  if (order.paymentMethod === "Cash on delivery" && order.paymentAccessToken) {
    context.addIssue({ code: "custom", path: ["paymentAccessToken"], message: "Cash on delivery does not use a payment link." });
  }
  if (order.paymentMethod !== "Cash on delivery" && !order.paymentAccessToken) {
    context.addIssue({ code: "custom", path: ["paymentAccessToken"], message: "A payment link token is required." });
  }
});

export const placeOrder = createServerFn({ method: "POST" })
  .validator((d: unknown) => orderSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").insert({
      order_number: data.orderNumber,
      customer_name: data.customer.name,
      phone: data.customer.phone,
      email: data.customer.email || null,
      sub_city: data.customer.subCity,
      city: data.customer.city,
      address: data.customer.address,
      items: data.items,
      image_url: data.items[0]?.image || null,
      subtotal: data.subtotal,
      delivery: data.shipping,
      total: data.total,
      payment_method: data.paymentMethod,
      payment_access_token_hash: data.paymentAccessToken
        ? await hashPaymentToken(data.paymentAccessToken)
        : null,
      payment_status: data.paymentMethod === "Cash on delivery" ? "not_required" : "pending",
      notes: data.notes || null,
    });
    if (error) {
      console.error("Order insert failed:", error.message);
      return { ok: false as const };
    }
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

export const getPaymentOrder = createServerFn({ method: "GET" })
  .validator((d: unknown) => paymentAccessSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tokenHash = await hashPaymentToken(data.token);
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("order_number, total, payment_method, payment_status, payment_submitted_at, payment_access_token_hash")
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

function hasValidImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") {
    return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  }
  return (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
}

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
      .select("order_number, payment_method, payment_status, payment_access_token_hash")
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

    const extension = data.mimeType === "image/jpeg" ? "jpg" : data.mimeType === "image/png" ? "png" : "webp";
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

    return { ok: true as const, submittedAt };
  });
