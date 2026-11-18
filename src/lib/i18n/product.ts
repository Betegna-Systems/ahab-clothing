import { useMemo } from "react";
import type { Product } from "@/lib/products";
import { useLocale, type Locale } from "./index";

/** Product text for the English-only storefront. */
export function productText(product: Product, locale: Locale) {
  void locale;
  return {
    name: product.name,
    description: product.description,
    fabric: product.fabric,
    care: product.care,
    color: (englishName: string) => englishName,
  };
}

/** `const text = useProductText(); text(product).name` */
export function useProductText() {
  const locale = useLocale();
  return useMemo(() => (product: Product) => productText(product, locale), [locale]);
}
