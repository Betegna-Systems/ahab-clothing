// Copies the built-in catalog (src/lib/products.ts) into Firestore `products`, in the
// same shape the admin app writes, so every product can be managed from the admin app.
//
//   node --env-file=.env scripts/migrate-catalog-to-firestore.mjs           # dry run
//   node --env-file=.env scripts/migrate-catalog-to-firestore.mjs --write   # create docs
//
// Only creates products that are missing; an existing Firestore product is never changed.
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const write = process.argv.includes("--write");

const manifest = JSON.parse(readFileSync("src/data/cloudinary-manifest.json", "utf8"));
const manifestByUrl = new Map(Object.values(manifest).map((asset) => [asset.optimizedUrl, asset]));

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
let products;
try {
  ({ products } = await vite.ssrLoadModule("/src/lib/products.ts"));
} finally {
  await vite.close();
}

function toFirestoreProduct(product) {
  const problems = [];
  if (!/^[a-z0-9-]{1,120}$/.test(product.slug)) problems.push("invalid slug");
  if (!(product.price > 0)) problems.push("missing price");
  if (!product.images.length) problems.push("no images");
  for (const image of product.images) {
    if (!image.startsWith("https://")) problems.push(`image is not a public URL: ${image}`);
  }
  if (product.images.length !== product.colors.length) {
    problems.push(`${product.colors.length} colors but ${product.images.length} images`);
  }

  const imageDetails = product.images.map((image) => {
    const asset = manifestByUrl.get(image);
    return {
      publicId: asset?.publicId ?? "",
      secureUrl: asset?.secureUrl ?? image,
      url: asset?.url ?? image,
      width: asset?.width ?? 0,
      height: asset?.height ?? 0,
      format: asset?.format ?? "jpg",
      bytes: asset?.bytes ?? 0,
    };
  });

  return {
    problems,
    data: {
      slug: product.slug,
      name: product.name,
      price: product.price,
      ...(product.compareAt ? { compareAt: product.compareAt } : {}),
      description: product.description,
      fabric: product.fabric,
      care: product.care,
      categories: product.categories,
      colors: product.colors.map(({ name, hex }) => ({ name, hex })),
      sizes: product.sizes,
      images: product.images,
      imageDetails,
      inStock: product.inStock,
      badge: product.badge ?? "new",
      popularity: product.popularity,
      createdAt: Timestamp.fromDate(new Date(`${product.createdAt}T00:00:00Z`)),
    },
  };
}

const prepared = products.map((product) => ({
  slug: product.slug,
  ...toFirestoreProduct(product),
}));
const invalid = prepared.filter((p) => p.problems.length);
for (const p of invalid) console.error(`✗ ${p.slug}: ${p.problems.join("; ")}`);
if (invalid.length) {
  console.error(`\n${invalid.length} product(s) need fixing first. Nothing was written.`);
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const collection = getFirestore(app).collection("products");

let created = 0;
let skipped = 0;
for (const { slug, data } of prepared) {
  const ref = collection.doc(slug);
  if ((await ref.get()).exists) {
    console.log(`= ${slug} already in Firestore — left unchanged`);
    skipped++;
    continue;
  }
  if (!write) {
    console.log(
      `+ ${slug} would be created (${data.colors.length} color, ${data.sizes.length} sizes, ETB ${data.price})`,
    );
    created++;
    continue;
  }
  await ref.create(data);
  console.log(`+ ${slug} created`);
  created++;
}

console.log(
  `\n${write ? "Created" : "Would create"} ${created}, skipped ${skipped} of ${prepared.length}.` +
    (write ? "" : "\nDry run only — re-run with --write to create them."),
);
