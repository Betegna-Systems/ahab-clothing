// The storefront is English-only. Keep Locale and path helpers for existing call sites.
export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_TAGS: Record<Locale, string> = { en: "en" };
export const OG_LOCALES: Record<Locale, string> = { en: "en_ET" };

export function isLocale(value: unknown): value is Locale {
  return value === "en";
}
export function splitLocale(pathname: string): { locale: Locale; pathname: string } {
  return { locale: "en", pathname };
}
export function localizePath(pathname: string, locale: Locale): string {
  void locale;
  return pathname;
}
