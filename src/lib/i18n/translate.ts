// English text is the key. This remains as a no-translation pass-through.
import type { Locale } from "./locale.ts";

export type Vars = Record<string, string | number>;

const dictionaries: Record<Locale, Record<string, string>> = { en: {} };

/** Replaces {name} placeholders with values. */
function fill(text: string, vars?: Vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function translate(locale: Locale, key: string, vars?: Vars) {
  return fill(dictionaries[locale][key] ?? key, vars);
}

export type Translator = (key: string, vars?: Vars) => string;

export function translator(locale: Locale): Translator {
  return (key, vars) => translate(locale, key, vars);
}
