// Pure order access rules shared by the order server functions. Keep runtime imports out of
// this module so the rules can be unit-tested without the app's path aliases.

type TokenGuarded = { payment_access_token_hash: string | null };

export const ORDER_NUMBER_PATTERN = /^AHAB-[A-Z0-9]{4,12}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// No 0/O/1/I so numbers read out over the phone are unambiguous.
const ORDER_NUMBER_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Random, non-sequential order number (32^8 ≈ 1.1e12 combinations). */
export function generateOrderNumber(random: (bytes: Uint8Array) => Uint8Array) {
  const bytes = random(new Uint8Array(8));
  return `AHAB-${Array.from(bytes, (byte) => ORDER_NUMBER_ALPHABET[byte % 32]).join("")}`;
}

/** A private order link is well formed: lets pages show "unavailable" instead of erroring. */
export function isWellFormedOrderLink(orderNumber: unknown, token: unknown) {
  return (
    typeof orderNumber === "string" &&
    typeof token === "string" &&
    ORDER_NUMBER_PATTERN.test(orderNumber) &&
    UUID_PATTERN.test(token)
  );
}

/** The private tracking link (order number + token) is the proof of a guest order. */
export function hasOrderToken(order: TokenGuarded | null | undefined, tokenHash: string) {
  return (
    Boolean(order?.payment_access_token_hash) && order!.payment_access_token_hash === tokenHash
  );
}

/** Account order history is limited to orders explicitly linked to the account, never by email. */
export function isOrderOwner(order: { customer_user_id: string | null }, userId: string) {
  return order.customer_user_id !== null && order.customer_user_id === userId;
}

export type ClaimDecision = "claim" | "already_yours" | "claimed_by_other" | "order_not_found";

export function canClaimOrder(
  order: (TokenGuarded & { customer_user_id: string | null }) | null | undefined,
  tokenHash: string,
  userId: string,
): ClaimDecision {
  if (!order || !hasOrderToken(order, tokenHash)) return "order_not_found";
  if (order.customer_user_id === null) return "claim";
  return order.customer_user_id === userId ? "already_yours" : "claimed_by_other";
}

export const RECEIPT_PAYMENT_METHODS = ["Telebirr", "CBE bank transfer"];

/** The admin app marks verified payments "paid"; "confirmed" is accepted for older orders. */
export function isPaymentConfirmed(paymentStatus: string | null | undefined) {
  return paymentStatus === "paid" || paymentStatus === "confirmed";
}

/** Customer-facing wording for an order's payment state. */
export function paymentStatusLabel(paymentStatus: string, paymentMethod: string) {
  if (isPaymentConfirmed(paymentStatus)) return "Payment confirmed";
  if (paymentStatus === "receipt_submitted") return "Receipt received, being verified";
  if (!RECEIPT_PAYMENT_METHODS.includes(paymentMethod)) return "Pay on delivery";
  return "Awaiting payment";
}

export type ReceiptDecision = "accept" | "order_not_found" | "already_submitted";

export function canSubmitReceipt(
  order: (TokenGuarded & { payment_method: string; payment_status: string }) | null | undefined,
  tokenHash: string,
): ReceiptDecision {
  if (!order || !hasOrderToken(order, tokenHash)) return "order_not_found";
  if (!RECEIPT_PAYMENT_METHODS.includes(order.payment_method)) return "order_not_found";
  return order.payment_status === "pending" ? "accept" : "already_submitted";
}

export type ReviewDecision = "allow" | "order_not_found" | "not_delivered" | "product_not_ordered";

export function reviewEligibility(
  order: (TokenGuarded & { status: string; items: unknown }) | null | undefined,
  tokenHash: string,
  productSlug: string,
): ReviewDecision {
  if (!order || !hasOrderToken(order, tokenHash)) return "order_not_found";
  if (order.status.trim().toLowerCase() !== "delivered") return "not_delivered";
  const items = Array.isArray(order.items) ? order.items : [];
  const ordered = items.some(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      (item as Record<string, unknown>)["slug"] === productSlug,
  );
  return ordered ? "allow" : "product_not_ordered";
}
