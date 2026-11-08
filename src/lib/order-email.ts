// Order confirmation email content. Keep runtime imports out of this module so Node's test
// runner can load it without the app's path aliases.

export type OrderEmailInput = {
  orderNumber: string;
  customerName: string;
  items: { name: string; color: string; size: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  /** Account to transfer to; empty for cash on delivery. */
  paymentAccount: string;
  /** Private tracking link (order number + token). */
  trackingUrl: string;
  /** Private receipt-upload link; only for transfer payments. */
  paymentUrl: string | null;
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
  const firstName = order.customerName.trim().split(/\s+/)[0] || "there";
  const subject = `Your AHAB order ${order.orderNumber}`;
  const payByTransfer = Boolean(order.paymentUrl && order.paymentAccount);

  const nextStep = payByTransfer
    ? `Please transfer ${etb(order.total)} via ${order.paymentMethod} to ${order.paymentAccount}, then upload your receipt so we can confirm your order.`
    : "We'll call you shortly to confirm delivery. You pay when your order arrives.";

  const text = [
    `Hi ${firstName},`,
    "",
    `Thank you for your order. Your order number is ${order.orderNumber}.`,
    "",
    ...order.items.map(
      (item) =>
        `- ${item.name} (${item.color}, size ${item.size}) x${item.qty}: ${etb(item.price * item.qty)}`,
    ),
    "",
    `Subtotal: ${etb(order.subtotal)}`,
    ...(order.discount ? [`Discount: -${etb(order.discount)}`] : []),
    `Delivery: ${order.shipping ? etb(order.shipping) : "Free"}`,
    `Total: ${etb(order.total)}`,
    `Payment: ${order.paymentMethod}`,
    "",
    nextStep,
    ...(payByTransfer ? [`Upload your receipt: ${order.paymentUrl}`] : []),
    "",
    `Track your order: ${order.trackingUrl}`,
    "",
    "These links are private to your order — keep this email and don't share them.",
    "",
    "AHAB Clothing · Made in Addis Ababa",
  ].join("\n");

  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;color:#6b6259">${label}</td><td style="padding:4px 0;text-align:right${strong ? ";font-weight:600;color:#1a1714" : ""}">${value}</td></tr>`;

  const button = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;background:#1a1714;color:#f8f3eb;text-decoration:none;padding:12px 22px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase">${label}</a>`;

  const html = `<!doctype html>
<html><body style="margin:0;background:#f8f3eb;font-family:Georgia,'Times New Roman',serif;color:#1a1714">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;padding:32px">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#b68a4c">AHAB Clothing</p>
<h1 style="margin:0 0 16px;font-size:26px;font-weight:400">Thank you, ${escapeHtml(firstName)}.</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6">Your order <strong>${escapeHtml(order.orderNumber)}</strong> is placed.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e8e0d4;border-bottom:1px solid #e8e0d4;padding:12px 0">
${order.items
  .map(
    (item) =>
      `<tr><td style="padding:6px 0">${escapeHtml(item.name)}<br><span style="font-size:12px;color:#6b6259">${escapeHtml(item.color)} · size ${escapeHtml(item.size)} · ×${item.qty}</span></td><td style="padding:6px 0;text-align:right;vertical-align:top">${etb(item.price * item.qty)}</td></tr>`,
  )
  .join("\n")}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:12px 0 24px">
${row("Subtotal", etb(order.subtotal))}
${order.discount ? row("Discount", `−${etb(order.discount)}`) : ""}
${row("Delivery", order.shipping ? etb(order.shipping) : "Free")}
${row("Total", etb(order.total), true)}
${row("Payment", escapeHtml(order.paymentMethod))}
</table>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(nextStep)}</p>
${payByTransfer ? `<p style="margin:0 0 12px">${button(order.paymentUrl!, "Upload receipt")}</p>` : ""}
<p style="margin:0 0 24px">${button(order.trackingUrl, "Track your order")}</p>
<p style="margin:0;font-size:12px;line-height:1.6;color:#6b6259">These links are private to your order — keep this email and don't share them.</p>
</td></tr></table>
<p style="font-size:12px;color:#6b6259;margin:16px 0 0">AHAB Clothing · Made in Addis Ababa</p>
</td></tr></table>
</body></html>`;

  return { subject, text, html };
}
