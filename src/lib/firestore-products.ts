import { useEffect, useState } from "react";
import { type Product, type Category, products as staticProducts } from "@/lib/products";

const PROJECT_ID = "ahab-clothing-9baef";
const REST_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`;

function parseFirestoreValue(val: unknown): unknown {
  if (!val || typeof val !== "object") return val;
  const obj = val as Record<string, unknown>;
  if ("stringValue" in obj) return obj.stringValue;
  if ("doubleValue" in obj) return Number(obj.doubleValue);
  if ("integerValue" in obj) return Number(obj.integerValue);
  if ("booleanValue" in obj) return Boolean(obj.booleanValue);
  if ("timestampValue" in obj) return obj.timestampValue;
  if ("arrayValue" in obj) {
    const arr = (obj.arrayValue as { values?: unknown[] })?.values ?? [];
    return arr.map(parseFirestoreValue);
  }
  if ("mapValue" in obj) {
    const fields = (obj.mapValue as { fields?: Record<string, unknown> })?.fields ?? {};
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = parseFirestoreValue(v);
    }
    return res;
  }
  return null;
}

export function firestoreRawToProduct(id: string, rawFields: Record<string, unknown>): Product {
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rawFields)) {
    data[k] = parseFirestoreValue(v);
  }

  const rawColors = (data.colors as Array<{ name?: string; hex?: string }> | undefined) ?? [];
  const colors = rawColors.length > 0
    ? rawColors.map((c) => ({
        name: c.name || "Standard",
        hex: c.hex || "#1A1714",
      }))
    : [{ name: "Standard", hex: "#1A1714" }];

  const rawImages = (data.images as string[] | undefined) ?? [];
  const images = rawImages.length > 0 ? rawImages : ["/placeholder.jpg"];

  const rawCategories = (data.categories as string[] | undefined) ?? [];
  const categories = (rawCategories.length > 0 ? rawCategories : ["basics"]) as Category[];

  let createdAt: string;
  if (typeof data.createdAt === "string") {
    createdAt = data.createdAt.slice(0, 10);
  } else {
    createdAt = new Date().toISOString().slice(0, 10);
  }

  return {
    slug: (data.slug as string) || id,
    name: (data.name as string) || "Untitled Product",
    price: Number(data.price) || 0,
    compareAt: data.compareAt ? Number(data.compareAt) : undefined,
    categories,
    colors,
    sizes: (data.sizes as string[] | undefined) ?? ["XS", "S", "M", "L", "XL"],
    images,
    description: (data.description as string) || "",
    fabric: (data.fabric as string) || "Premium Stretch Jersey",
    care: (data.care as string) || "Machine wash cold. Dry flat.",
    badge: (data.badge as "new" | "sale" | "bestseller" | undefined) ?? "new",
    rating: typeof data.rating === "number" ? data.rating : 5,
    reviews: typeof data.reviews === "number" ? data.reviews : 1,
    inStock: data.inStock !== false,
    createdAt,
    popularity: typeof data.popularity === "number" ? data.popularity : 85,
  };
}

let _cachedFirestoreProducts: Product[] = [];

/**
 * Fetch a single product by slug from Firestore REST API
 */
export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  // Check static list first for standard products
  const staticFound = staticProducts.find((p) => p.slug === slug);
  if (staticFound) return staticFound;

  // Check in-memory cache
  const cached = _cachedFirestoreProducts.find((p) => p.slug === slug);
  if (cached) return cached;

  try {
    const res = await fetch(`${REST_BASE_URL}/${slug}`);
    if (res.ok) {
      const doc = await res.json();
      const product = firestoreRawToProduct(slug, doc.fields ?? {});
      _cachedFirestoreProducts.unshift(product);
      return product;
    }
  } catch (err) {
    console.warn("fetchProductBySlug error:", err);
  }

  return undefined;
}

/**
 * Fetch all Firestore products via REST API
 */
export async function fetchAllFirestoreProducts(): Promise<Product[]> {
  try {
    const res = await fetch(REST_BASE_URL);
    if (!res.ok) return [];
    const data = await res.json();
    const docs = (data.documents as Array<{ name: string; fields: Record<string, unknown> }>) ?? [];
    const products = docs.map((d) => {
      const id = d.name.split("/").pop()!;
      return firestoreRawToProduct(id, d.fields ?? {});
    });
    _cachedFirestoreProducts = products;
    return products;
  } catch (err) {
    console.warn("fetchAllFirestoreProducts error:", err);
    return [];
  }
}

export function getAllProductsCached(): Product[] {
  const firestoreSlugs = new Set(_cachedFirestoreProducts.map((p) => p.slug));
  const kept = staticProducts.filter((p) => !firestoreSlugs.has(p.slug));
  return [..._cachedFirestoreProducts, ...kept];
}

export function getProductCached(slug: string): Product | undefined {
  return (
    _cachedFirestoreProducts.find((p) => p.slug === slug) ??
    staticProducts.find((p) => p.slug === slug)
  );
}

/**
 * Client hook: fetches products on mount, polls periodically, and blends with static catalog
 */
export function useAllProducts() {
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>(_cachedFirestoreProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const remote = await fetchAllFirestoreProducts();
      if (mounted) {
        setDynamicProducts(remote);
        setLoading(false);
      }
    }

    load();

    // Re-check Firestore every 10 seconds so newly uploaded items from mobile appear automatically
    const interval = setInterval(load, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const merged = (() => {
    const dynamicSlugs = new Set(dynamicProducts.map((p) => p.slug));
    const kept = staticProducts.filter((p) => !dynamicSlugs.has(p.slug));
    return [...dynamicProducts, ...kept];
  })();

  return { products: merged, loading };
}
