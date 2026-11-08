import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { LOCALE_TAGS, splitLocale, type Locale } from "./locale";
import { translator, type Translator } from "./translate";

export { LOCALES, localizePath, splitLocale, type Locale } from "./locale";
export { translate, translator, type Translator } from "./translate";

/** Router context shared by every route (set per request in router.tsx). */
export type I18nContext = { locale: Locale };

/** The page language, from the public URL (/am/… is Amharic). */
export function useLocale(): Locale {
  return useRouterState({
    select: (state) => splitLocale(state.location.publicHref.split(/[?#]/)[0] ?? "/").locale,
  });
}

/** Translator for the current page language: pass the English text and optional {vars}. */
export function useT(): Translator {
  const locale = useLocale();
  return useMemo(() => translator(locale), [locale]);
}

/** Translator for route `head()` functions, which receive the match context. */
export function headT(context: { i18n?: I18nContext } | undefined): {
  t: Translator;
  locale: Locale;
} {
  const locale = context?.i18n?.locale ?? "en";
  return { t: translator(locale), locale };
}

/** Date in the page language, e.g. "8 November 2026" / "8 ኖቬምበር 2026". */
export function formatDate(value: string | number | Date, locale: Locale) {
  return new Date(value).toLocaleDateString(LOCALE_TAGS[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
