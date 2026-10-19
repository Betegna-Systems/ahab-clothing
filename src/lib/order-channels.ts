import { formatPrice } from "@/lib/products";

/**
 * AHAB order channels — replace these with your real contact details.
 * TELEGRAM_USERNAME: without "@". WHATSAPP_NUMBER: international format, digits only.
 */
export const TELEGRAM_USERNAME = "Daniel_Obrein";
export const WHATSAPP_NUMBER = "251941219026";

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

/** Sends the order to the AHAB orders Google Sheet. */
export async function submitOrder(order: OrderPayload): Promise<boolean> {
  try {
    const { placeOrder } = await import("@/lib/orders.functions");
    const res = await placeOrder({ data: order });
    return res.ok;
  } catch {
    return false;
  }
}
