import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
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

describe("English translations", () => {
  const { keys, dynamic } = usedKeys();
  it("finds the site's text", () => {
    assert.ok(keys.size > 50, `only ${keys.size} t() keys found — is the scan working?`);
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
  it("uses English paths", () => {
    assert.deepEqual(splitLocale("/shop"), { locale: "en", pathname: "/shop" });
    assert.equal(localizePath("/shop", "en"), "/shop");
    assert.equal(localizePath("/api/admin/firebase-token", "en"), "/api/admin/firebase-token");
  });
  it("fills placeholders", () => {
    assert.equal(
      translate("en", "Add {amount} for free Addis Ababa delivery.", { amount: "ETB 5" }),
      "Add ETB 5 for free Addis Ababa delivery.",
    );
  });
});
