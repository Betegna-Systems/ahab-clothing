import type { Product } from "@/lib/products";

// Shared by checkout (display) and placeOrder (authoritative). Keep runtime imports out of
// this module so its rules can be unit-tested without the app's path aliases.

export const PROMOS: Record<string, number> = { AHAB10: 0.1, MADEWITHLOVE: 0.15 };
export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 250;

export function promoRate(code: string | null | undefined) {
  if (!code) return 0;
  return Object.prototype.hasOwnProperty.call(PROMOS, code) ? PROMOS[code]! : 0;
}

export function orderTotals(subtotal: number, promoCode: string | null | undefined) {
  const discount = Math.round(subtotal * promoRate(promoCode));
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
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
      promoCode: string | null;
    }
  | { ok: false; reason: "unavailable" | "invalid_promo" };

/** Prices requested lines from the catalog; browser-supplied prices are never used. */
export function priceOrder(
  lines: RequestedLine[],
  catalog: Pick<Product, "slug" | "name" | "price" | "colors" | "sizes" | "images" | "inStock">[],
  promoCode: string | null | undefined,
): PricedOrder {
  const code = promoCode ? promoCode.trim().toUpperCase() : null;
  if (code && !promoRate(code)) return { ok: false, reason: "invalid_promo" };

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
  return { ok: true, items, promoCode: code, ...orderTotals(subtotal, code) };
}
