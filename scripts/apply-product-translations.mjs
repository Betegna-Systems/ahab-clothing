// Fills empty Amharic product fields in Firestore from scripts/product-translations-am.json.
//
//   node --env-file=.env scripts/apply-product-translations.mjs           # dry run
//   node --env-file=.env scripts/apply-product-translations.mjs --write   # apply
//
// Only EMPTY fields are filled (name_am, description_am, fabric_am, care_am, colors[].name_am),
// so anything typed in the admin app is never overwritten. English fields are not touched.
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const write = process.argv.includes("--write");
const drafts = JSON.parse(readFileSync("scripts/product-translations-am.json", "utf8"));

const db = getFirestore(
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  }),
);

const empty = (value) => typeof value !== "string" || !value.trim();
let updatedDocs = 0;
const missing = new Set();

const snapshot = await db.collection("products").get();
for (const doc of snapshot.docs) {
  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(doc.ref);
    const data = fresh.data() ?? {};
    const draft = drafts.products[doc.id] ?? {};
    const changes = {};
    const fill = (field, value, source) => {
      if (!empty(data[field])) return;
      if (empty(value)) missing.add(`${doc.id}: ${field} (${source})`);
      else changes[field] = value;
    };
    fill("name_am", draft.name, "no product draft");
    fill("description_am", draft.description, "no product draft");
    fill("fabric_am", drafts.fabric[data.fabric], `fabric "${data.fabric}"`);
    fill("care_am", drafts.care[data.care], `care "${data.care}"`);

    let colorsChanged = false;
    const colors = (data.colors ?? []).map((color) => {
      if (!empty(color.name_am)) return color;
      const name = drafts.colors[color.name];
      if (!name) {
        missing.add(`${doc.id}: color "${color.name}"`);
        return color;
      }
      colorsChanged = true;
      return { ...color, name_am: name };
    });
    if (colorsChanged) changes.colors = colors;

    const fields = Object.keys(changes);
    if (!fields.length) return;
    updatedDocs++;
    console.log(`${write ? "✓" : "+"} ${doc.id}: ${fields.join(", ")}`);
    if (write) tx.update(doc.ref, changes);
  });
}

if (missing.size) console.log(`\nNo draft for:\n  ${[...missing].join("\n  ")}`);
console.log(
  `\n${write ? "Updated" : "Would update"} ${updatedDocs} of ${snapshot.size} products.` +
    (write ? "" : " Dry run — re-run with --write to apply."),
);
