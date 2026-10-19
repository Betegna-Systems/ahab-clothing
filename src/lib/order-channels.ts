import { formatPrice } from "@/lib/products";

/**
 * AHAB order channels — replace these with your real contact details.
 * TELEGRAM_USERNAME: without "@". WHATSAPP_NUMBER: international format, digits only.
 * ORDER_WEBHOOK_URL: optional. Any endpoint (your own API, Make/n8n, Google Apps Script)
 * that accepts a JSON POST. Leave empty to skip.
 */
export const TELEGRAM_USERNAME = "Daniel_Obrein";
export const WHATSAPP_NUMBER = "251941219026";
export const ORDER_WEBHOOK_URL = (import.meta.env['VITE_ORDER_WEBHOOK_URL'] as string | undefined) ?? "";

export type OrderLine = { name: string; color: string; size: string; qty: number; price: number };

export function buildOrderMessage(lines: OrderLine[], extra?: string) {
  const items = lines
    .map((l) => `• ${l.name} — ${l.color}, size ${l.size}, ×${l.qty} (${formatPrice(l.price * l.qty)})`)
    .join("\n");
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return `Hello AHAB, I'd like to order:\n${items}\nTotal: ${formatPrice(total)}\nDelivery: Addis Ababa${extra ? `\n${extra}` : ""}`;
}

export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
export const telegramLink = (text: string) =>
  `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;

export type OrderPayload = {
  orderNumber: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string; address: string; subCity: string; city: string };
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  notes: string;
};

/** Sends the order to your own backend/webhook. Returns true if delivered (or no webhook set). */
export async function submitOrder(order: OrderPayload): Promise<boolean> {
  if (!ORDER_WEBHOOK_URL) return true;
  try {
    const res = await fetch(ORDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(order),
    });
    return res.ok || res.type === "opaque";
  } catch {
    return false;
  }
}
