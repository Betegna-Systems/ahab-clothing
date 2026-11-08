// Order confirmation email content. Keep runtime imports limited to sibling modules so Node's
// test runner can load it without the app's path aliases.
import { translator } from "./i18n/translate.ts";
import type { Locale } from "./i18n/locale.ts";

export type OrderEmailInput = {
  orderNumber: string;
  customerName: string;
  /** Item name and colour as shown to the customer (already in the email's language). */
  items: { name: string; color: string; size: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  /** English payment method label as saved with the order ("Telebirr", …). */
  paymentMethod: string;
  /** Account to transfer to; empty for cash on delivery. */
  paymentAccount: string;
  /** Private tracking link (order number + token), already in the email's language. */
  trackingUrl: string;
  /** Private receipt-upload link; only for transfer payments. */
  paymentUrl: string | null;
  /** Language of the email; the shopper's checkout language. Defaults to English. */
  locale?: Locale;
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const etb = (amount: number) => `ETB ${amount.toLocaleString("en-US")}`;

export function buildOrderConfirmationEmail(order: OrderEmailInput) {
  const t = translator(order.locale ?? "en");
  const firstName = order.customerName.trim().split(/\s+/)[0] || "";
  const greetingName = firstName || t("there");
  const subject = t("Your AHAB order {number}", { number: order.orderNumber });
  const payByTransfer = Boolean(order.paymentUrl && order.paymentAccount);
  // Dictionary entries exist for each payment method label ("Cash on delivery", "Telebirr", …).
  const paymentMethod = t(order.paymentMethod);
  const delivery = order.shipping ? etb(order.shipping) : t("Free");

  const nextStep = payByTransfer
    ? t(
        "Please transfer {amount} via {method} to {account}, then upload your receipt so we can confirm your order.",
        { amount: etb(order.total), method: paymentMethod, account: order.paymentAccount },
      )
    : t("We'll call you shortly to confirm delivery. You pay when your order arrives.");
  const privacyNote = t(
    "These links are private to your order — keep this email and don't share them.",
  );
  const signature = t("AHAB Clothing · Made in Addis Ababa");

  const text = [
    t("Hi {name},", { name: greetingName }),
    "",
    t("Thank you for your order. Your order number is {number}.", { number: order.orderNumber }),
    "",
    ...order.items.map(
      (item) =>
        `- ${t("{name} ({color}, size {size}) ×{qty}: {price}", {
          name: item.name,
          color: item.color,
          size: item.size,
          qty: item.qty,
          price: etb(item.price * item.qty),
        })}`,
    ),
    "",
    `${t("Subtotal")}: ${etb(order.subtotal)}`,
    ...(order.discount ? [`${t("Discount")}: -${etb(order.discount)}`] : []),
    `${t("Delivery")}: ${delivery}`,
    `${t("Total")}: ${etb(order.total)}`,
    `${t("Payment")}: ${paymentMethod}`,
    "",
    nextStep,
    ...(payByTransfer ? [`${t("Upload your receipt")}: ${order.paymentUrl}`] : []),
    "",
    `${t("Track your order")}: ${order.trackingUrl}`,
    "",
    privacyNote,
    "",
    signature,
  ].join("\n");

  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;color:#6b6259">${escapeHtml(label)}</td><td style="padding:4px 0;text-align:right${strong ? ";font-weight:600;color:#1a1714" : ""}">${value}</td></tr>`;

  const button = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;background:#1a1714;color:#f8f3eb;text-decoration:none;padding:12px 22px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase">${escapeHtml(label)}</a>`;

  // Customer-entered text is escaped before it is placed into the translated sentence.
  const heading = firstName
    ? t("Thank you, {name}.", { name: escapeHtml(firstName) })
    : t("Thank you for your order.");
  const placed = t("Your order {number} is placed.", {
    number: `<strong>${escapeHtml(order.orderNumber)}</strong>`,
  });

  const html = `<!doctype html>
<html lang="${order.locale ?? "en"}"><body style="margin:0;background:#f8f3eb;font-family:Georgia,'Times New Roman',serif;color:#1a1714">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#b68a4c">AHAB Clothing</p>
<h1 style="margin:0 0 16px;font-size:26px;font-weight:400">${heading}</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6">${placed}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e8e0d4;border-bottom:1px solid #e8e0d4;padding:12px 0">
${order.items
  .map(
    (item) =>
      `<tr><td style="padding:6px 0">${escapeHtml(item.name)}<br><span style="font-size:12px;color:#6b6259">${escapeHtml(item.color)} · ${escapeHtml(t("size {size}", { size: item.size }))} · ×${item.qty}</span></td><td style="padding:6px 0;text-align:right;vertical-align:top">${etb(item.price * item.qty)}</td></tr>`,
  )
  .join("\n")}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:12px 0 24px">
${row(t("Subtotal"), etb(order.subtotal))}
${order.discount ? row(t("Discount"), `−${etb(order.discount)}`) : ""}
${row(t("Delivery"), escapeHtml(delivery))}
${row(t("Total"), etb(order.total), true)}
${row(t("Payment"), escapeHtml(paymentMethod))}
</table>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(nextStep)}</p>
${payByTransfer ? `<p style="margin:0 0 12px">${button(order.paymentUrl!, t("Upload receipt"))}</p>` : ""}
<p style="margin:0 0 24px">${button(order.trackingUrl, t("Track your order"))}</p>
<p style="margin:0;font-size:12px;line-height:1.6;color:#6b6259">${escapeHtml(privacyNote)}</p>
</td></tr></table>
<p style="font-size:12px;color:#6b6259;margin:16px 0 0">${escapeHtml(signature)}</p>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}
