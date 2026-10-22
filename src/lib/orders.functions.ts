import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MAX_CART_QUANTITY } from "@/lib/order-limits";

const line = z.object({
  name: z.string().max(200),
  color: z.string().max(100),
  size: z.string().max(20),
  qty: z.number().int().min(1).max(MAX_CART_QUANTITY),
  price: z.number().min(0).max(1_000_000),
});

const orderSchema = z.object({
  orderNumber: z.string().max(40),
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
  paymentMethod: z.string().max(60),
  notes: z.string().max(1000),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderSchema.parse(d))
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
      subtotal: data.subtotal,
      delivery: data.shipping,
      total: data.total,
      payment_method: data.paymentMethod,
      notes: data.notes || null,
    });
    if (error) {
      console.error("Order insert failed:", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
