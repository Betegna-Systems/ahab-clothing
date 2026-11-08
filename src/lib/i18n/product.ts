import { useMemo } from "react";
import type { Product } from "@/lib/products";
import { useLocale, type Locale } from "./index";

/**
 * Product text in the page language. Amharic comes from the admin app's optional Amharic
 * fields; anything left empty shows the English text. Color names are display-only — always
 * pass the English color name to the bag, stock and orders.
 */
export function productText(product: Product, locale: Locale) {
  const am = locale === "am" ? product.am : undefined;
  return {
    name: am?.name || product.name,
    description: am?.description || product.description,
    fabric: am?.fabric || product.fabric,
    care: am?.care || product.care,
    color: (englishName: string) => am?.colors?.[englishName] || englishName,
  };
}

/** `const text = useProductText(); text(product).name` */
export function useProductText() {
  const locale = useLocale();
  return useMemo(() => (product: Product) => productText(product, locale), [locale]);
}
