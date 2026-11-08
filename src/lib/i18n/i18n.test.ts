import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { am, amSections } from "./am.ts";
import { localizePath, splitLocale } from "./locale.ts";
import { translate } from "./translate.ts";

const SRC = join(import.meta.dirname, "..", "..");
// Internal admin screens and generated/vendor code are not translated.
const SKIP = [
  /components[\\/]ui[\\/]/,
  /integrations[\\/]/,
  /routes[\\/]admin\./,
  /\.test\.ts$/,
  /routeTree\.gen\.ts$/,
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !SKIP.some((p) => p.test(path)) ? [path] : [];
  });
}

/** Every t("…") / t('…') key in the app, with where it is used. */
function usedKeys() {
  const keys = new Map<string, string>();
  const dynamic: string[] = [];
  for (const file of sourceFiles(SRC)) {
    const text = readFileSync(file, "utf8");
    const call = /(?<![\w.$])t\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`)/g;
    for (const match of text.matchAll(call)) {
      const raw = match[1]!;
      const where = `${file.slice(SRC.length + 1)}:${text.slice(0, match.index).split("\n").length}`;
      if (raw === "`") {
        dynamic.push(where);
        continue;
      }
      const key = raw.startsWith('"')
        ? (JSON.parse(raw) as string)
        : raw.slice(1, -1).replace(/\\'/g, "'");
      if (!keys.has(key)) keys.set(key, where);
    }
  }
  return { keys, dynamic };
}

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("Amharic translations", () => {
  const { keys, dynamic } = usedKeys();

  it("finds the site's text", () => {
    assert.ok(keys.size > 50, `only ${keys.size} t() keys found — is the scan working?`);
  });

  it("has an Amharic entry for every t() text in the app", () => {
    const missing = [...keys].filter(([key]) => !(key in am)).map(([k, w]) => `${w}  ${k}`);
    assert.deepEqual(missing, [], `Missing Amharic for:\n${missing.join("\n")}`);
  });

  it("keeps every {placeholder} in the Amharic text", () => {
    const broken = Object.entries(am)
      .filter(([en, amText]) => placeholders(en).join() !== placeholders(amText).join())
      .map(([en]) => en);
    assert.deepEqual(broken, []);
  });

  it("never translates the same text differently in two files", () => {
    const seen = new Map<string, string>();
    const conflicts: string[] = [];
    for (const [section, entries] of Object.entries(amSections)) {
      for (const [key, value] of Object.entries(entries)) {
        const earlier = seen.get(key);
        if (earlier !== undefined && earlier !== value) conflicts.push(`${section}: ${key}`);
        seen.set(key, value);
      }
    }
    assert.deepEqual(conflicts, []);
  });

  it("uses plain strings as keys (template literals can't be translated)", () => {
    assert.deepEqual(
      dynamic,
      [],
      `Use t("… {name} …", { name }) instead at:\n${dynamic.join("\n")}`,
    );
  });
});

describe("language URLs and lookup", () => {
  it("reads and writes the /am prefix", () => {
    assert.deepEqual(splitLocale("/am/shop"), { locale: "am", pathname: "/shop" });
    assert.deepEqual(splitLocale("/am"), { locale: "am", pathname: "/" });
    assert.deepEqual(splitLocale("/amazing"), { locale: "en", pathname: "/amazing" });
    assert.equal(localizePath("/shop", "am"), "/am/shop");
    assert.equal(localizePath("/", "am"), "/am");
    assert.equal(localizePath("/am/shop", "en"), "/shop");
    assert.equal(localizePath("/api/admin/firebase-token", "am"), "/api/admin/firebase-token");
  });

  it("falls back to English and fills placeholders", () => {
    assert.equal(translate("am", "Not a real key {x}", { x: 1 }), "Not a real key 1");
    assert.equal(
      translate("en", "Add {amount} for free Addis Ababa delivery.", { amount: "ETB 5" }),
      "Add ETB 5 for free Addis Ababa delivery.",
    );
    assert.equal(translate("am", "Your bag"), am["Your bag"]);
  });
});
