import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  type Product,
  type Category,
  type ProductTranslation,
  products as staticProducts,
} from "@/lib/products";

const PROJECT_ID = "ahab-clothing-9baef";
const REST_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`;
const FETCH_TIMEOUT_MS = 4000;
const POLL_INTERVAL_MS = 60_000;

async function fetchJson(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  return res;
}

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

  const rawColors =
    (data.colors as Array<{ name?: string; hex?: string; name_am?: string }> | undefined) ?? [];
  const colors =
    rawColors.length > 0
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
    rating: 0,
    reviews: 0,
    inStock: data.inStock !== false,
    createdAt,
    popularity: typeof data.popularity === "number" ? data.popularity : 85,
    am: amharicFields(data, rawColors),
  };
}

const text = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/** Optional Amharic fields written by the admin app (name_am, description_am, …). */
function amharicFields(
  data: Record<string, unknown>,
  rawColors: Array<{ name?: string; name_am?: string }>,
): ProductTranslation | undefined {
  const colors: Record<string, string> = {};
  for (const c of rawColors) {
    const amName = text(c.name_am);
    if (c.name && amName) colors[c.name] = amName;
  }
  const am: ProductTranslation = {
    name: text(data.name_am),
    description: text(data.description_am),
    fabric: text(data.fabric_am),
    care: text(data.care_am),
    colors,
  };
  return am.name || am.description || am.fabric || am.care || Object.keys(colors).length
    ? am
    : undefined;
}

// Firestore is the catalog: the admin app adds, edits and deletes products there. The
// built-in list in products.ts is only an emergency fallback for when Firestore cannot be
// reached, so a product deleted in the admin app does not reappear from it.
let _cachedFirestoreProducts: Product[] = [];
let _firestoreLoaded = false;

const SLUG_PATTERN = /^[a-z0-9-]{1,120}$/;

/** The catalog to show: Firestore once it has answered, otherwise the built-in fallback. */
function catalogFrom(remote: Product[] | null): Product[] {
  return remote ?? staticProducts;
}

/**
 * Fetch a single product by slug from Firestore REST API
 */
export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!SLUG_PATTERN.test(slug)) return undefined;

  try {
    const res = await fetchJson(`${REST_BASE_URL}/${slug}`);
    if (res.ok) {
      const doc = await res.json();
      return firestoreRawToProduct(slug, doc.fields ?? {});
    }
    // Firestore answered: the product does not exist (or was deleted).
    if (res.status === 404) return undefined;
  } catch (err) {
    console.warn("fetchProductBySlug error:", err);
  }

  // Firestore unreachable: use the last good catalog, then the built-in fallback.
  return getProductCached(slug);
}

/**
 * Fetch all Firestore products via REST API. Returns null when Firestore could not be read.
 */
export async function fetchAllFirestoreProducts(): Promise<Product[] | null> {
  try {
    const products: Product[] = [];
    let pageToken = "";
    do {
      const res = await fetchJson(
        `${REST_BASE_URL}?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      const docs =
        (data.documents as Array<{ name: string; fields: Record<string, unknown> }>) ?? [];
      for (const d of docs) {
        products.push(firestoreRawToProduct(d.name.split("/").pop()!, d.fields ?? {}));
      }
      pageToken = typeof data.nextPageToken === "string" ? data.nextPageToken : "";
    } while (pageToken);

    _cachedFirestoreProducts = products;
    _firestoreLoaded = true;
    return products;
  } catch (err) {
    console.warn("fetchAllFirestoreProducts error:", err);
    return null;
  }
}

export function getAllProductsCached(): Product[] {
  return catalogFrom(_firestoreLoaded ? _cachedFirestoreProducts : null);
}

export function getProductCached(slug: string): Product | undefined {
  return getAllProductsCached().find((p) => p.slug === slug);
}

/**
 * Client hook: fetches products on mount and polls periodically. Shows the built-in
 * fallback until Firestore answers; a later failed poll keeps the last good catalog.
 */
export function useAllProducts() {
  // Start from the catalog the root route loaded on the server, so the first render (and
  // what search engines see) already shows live Firestore products and their translations.
  const initialCatalog = useRouterState({
    select: (state) =>
      (state.matches[0]?.loaderData as { catalog?: Product[] | null } | undefined)?.catalog ?? null,
  });
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(initialCatalog);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const remote = await fetchAllFirestoreProducts();
      if (mounted) {
        if (remote) setRemoteProducts(remote);
        setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { products: catalogFrom(remoteProducts), loading };
}
