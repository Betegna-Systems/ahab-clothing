import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Google Sheet that receives website orders (ID from the sheet's URL).
const SPREADSHEET_ID = "";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const line = z.object({
  name: z.string().max(200),
  color: z.string().max(100),
  size: z.string().max(20),
  qty: z.number().int().min(1).max(50),
  price: z.number().min(0).max(1_000_000),
});

const orderSchema = z.object({
  orderNumber: z.string().max(40),
  createdAt: z.string().max(40),
  customer: z.object({
    name: z.string().min(1).max(200),
    email: z.string().max(200),
    phone: z.string().min(3).max(40),
    address: z.string().max(500),
    subCity: z.string().max(100),
    city: z.string().max(100),
  }),
  items: z.array(line).min(1).max(50),
  subtotal: z.number(),
  shipping: z.number(),
  total: z.number(),
  paymentMethod: z.string().max(60),
  notes: z.string().max(1000),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderSchema.parse(d))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env['LOVABLE_API_KEY'];
    const SHEETS_KEY = process.env['GOOGLE_SHEETS_API_KEY'];
    if (!LOVABLE_API_KEY || !SHEETS_KEY || !SPREADSHEET_ID) {
      console.error("Order sheet not configured");
      return { ok: false as const };
    }
    const items = data.items.map((l) => `${l.qty}× ${l.name} (${l.color}, ${l.size})`).join("; ");
    const row = [
      data.orderNumber,
      new Date(data.createdAt).toLocaleString("en-GB", { timeZone: "Africa/Addis_Ababa" }),
      data.customer.name,
      `'${data.customer.phone}`,
      data.customer.email,
      data.customer.subCity,
      `${data.customer.address}, ${data.customer.city}`,
      items,
      data.subtotal,
      data.shipping,
      data.total,
      data.paymentMethod,
      data.notes,
      "New",
    ];
    const res = await fetch(
      `${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values/A1:N1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": SHEETS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
      },
    );
    if (!res.ok) {
      console.error(`Sheets append failed [${res.status}]: ${await res.text()}`);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
