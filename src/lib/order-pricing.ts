import type { Product } from "@/lib/products";

// Shared by checkout (display) and placeOrder (authoritative). Keep runtime imports out of
// this module so its rules can be unit-tested without the app's path aliases.

export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 250;

/** A promo code as validated by the server (from the promo_codes table). */
export type Promo = { code: string; percentOff: number; minSubtotal: number };

/** promo_codes row fields the rules need. */
export type PromoRow = {
  code: string;
  percent_off: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number | null;
  min_subtotal: number;
};

export type PromoStatus = "ok" | "not_found" | "inactive" | "not_started" | "expired" | "used_up";

export const PROMO_CODE_PATTERN = /^[A-Z0-9]{3,20}$/;

/** Uppercases and validates a typed code; null when it can't be a code at all. */
export function normalizePromoCode(code: string | null | undefined) {
  const normalized = (code ?? "").trim().toUpperCase();
  return PROMO_CODE_PATTERN.test(normalized) ? normalized : null;
}

/** Whether a code can be used right now. `uses` counts its non-cancelled orders. */
export function promoStatus(
  row: PromoRow | null | undefined,
  now: Date,
  uses: number,
): PromoStatus {
  if (!row) return "not_found";
  if (!row.active) return "inactive";
  if (row.starts_at && new Date(row.starts_at) > now) return "not_started";
  if (row.expires_at && new Date(row.expires_at) <= now) return "expired";
  if (row.max_uses !== null && uses >= row.max_uses) return "used_up";
  return "ok";
}

export function promoFromRow(row: PromoRow): Promo {
  return { code: row.code, percentOff: row.percent_off, minSubtotal: row.min_subtotal };
}

/** A code only takes effect once the bag reaches its minimum order. */
export function promoApplies(promo: Promo | null | undefined, subtotal: number): promo is Promo {
  return Boolean(promo) && subtotal > 0 && subtotal >= promo!.minSubtotal;
}

export function orderTotals(subtotal: number, promo: Promo | null | undefined) {
  const applied = promoApplies(promo, subtotal) ? promo : null;
  const discount = applied ? Math.round((subtotal * applied.percentOff) / 100) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    promoCode: applied?.code ?? null,
  };
}

export type RequestedLine = { slug: string; color: string; size: string; qty: number };

export type PricedLine = RequestedLine & { name: string; price: number; image: string };

export type PricedOrder =
  | {
      ok: true;
      items: PricedLine[];
      subtotal: number;
      discount: number;
      shipping: number;
      total: number;
      /** The code that was applied (null when none, or below its minimum order). */
      promoCode: string | null;
      promoPercent: number | null;
    }
  | { ok: false; reason: "unavailable" };

/** Prices requested lines from the catalog; browser-supplied prices are never used. */
export function priceOrder(
  lines: RequestedLine[],
  catalog: Pick<Product, "slug" | "name" | "price" | "colors" | "sizes" | "images" | "inStock">[],
  promo: Promo | null,
): PricedOrder {
  const items: PricedLine[] = [];
  for (const line of lines) {
    const product = catalog.find((candidate) => candidate.slug === line.slug);
    const colorIndex = product?.colors.findIndex((color) => color.name === line.color) ?? -1;
    if (
      !product ||
      !product.inStock ||
      !(product.price > 0) ||
      colorIndex < 0 ||
      !product.sizes.includes(line.size) ||
      !Number.isInteger(line.qty) ||
      line.qty < 1
    ) {
      return { ok: false, reason: "unavailable" };
    }
    items.push({
      ...line,
      name: product.name,
      price: product.price,
      image: product.images[colorIndex] ?? product.images[0] ?? "",
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totals = orderTotals(subtotal, promo);
  return {
    ok: true,
    items,
    ...totals,
    promoPercent: totals.promoCode && promo ? promo.percentOff : null,
  };
}
