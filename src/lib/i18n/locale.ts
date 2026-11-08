// URL ↔ language rules. Amharic pages live under /am (e.g. /am/shop); English has no prefix.
// Keep runtime imports out of this module so Node's test runner can load it.

export const LOCALES = ["en", "am"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** BCP 47 tags for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAGS: Record<Locale, string> = { en: "en", am: "am" };
export const OG_LOCALES: Record<Locale, string> = { en: "en_ET", am: "am_ET" };

const PREFIX = "/am";

/** Paths served outside the router (APIs, files) never get a language prefix. */
const UNLOCALIZED = [
  /^\/api\//,
  /^\/_serverFn/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /^\/assets\//,
];

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "am";
}

/** Splits "/am/shop" into { locale: "am", pathname: "/shop" }. */
export function splitLocale(pathname: string): { locale: Locale; pathname: string } {
  if (pathname === PREFIX || pathname.startsWith(`${PREFIX}/`)) {
    return { locale: "am", pathname: pathname.slice(PREFIX.length) || "/" };
  }
  return { locale: "en", pathname };
}

/** Adds the language prefix to a router path ("/shop" → "/am/shop" for Amharic). */
export function localizePath(pathname: string, locale: Locale): string {
  const bare = splitLocale(pathname).pathname;
  if (locale === "en" || UNLOCALIZED.some((pattern) => pattern.test(bare))) return bare;
  return bare === "/" ? PREFIX : `${PREFIX}${bare}`;
}
