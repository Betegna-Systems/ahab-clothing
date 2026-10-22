import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Product, type Category, products as staticProducts } from "@/lib/products";

/**
 * Converts a Firestore document into the website's Product type.
 */
export function firestoreDocToProduct(id: string, data: Record<string, unknown>): Product {
  const rawColors = (data.colors as Array<{ name?: string; hex?: string }> | undefined) ?? [];
  const colors = rawColors.length > 0
    ? rawColors.map((c) => ({
        name: c.name || "Default",
        hex: c.hex || "#1A1714",
      }))
    : [{ name: "Standard", hex: "#1A1714" }];

  const rawImages = (data.images as string[] | undefined) ?? [];
  const images = rawImages.length > 0 ? rawImages : ["/placeholder.jpg"];

  const rawCategories = (data.categories as string[] | undefined) ?? [];
  const categories = (rawCategories.length > 0 ? rawCategories : ["basics"]) as Category[];

  let createdAt: string;
  const rawCreatedAt = data.createdAt;
  if (rawCreatedAt instanceof Timestamp) {
    createdAt = rawCreatedAt.toDate().toISOString().slice(0, 10);
  } else if (rawCreatedAt && typeof rawCreatedAt === "object" && "seconds" in rawCreatedAt) {
    createdAt = new Date(Number((rawCreatedAt as { seconds: number }).seconds) * 1000)
      .toISOString()
      .slice(0, 10);
  } else if (typeof rawCreatedAt === "string") {
    createdAt = rawCreatedAt;
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
    fabric: (data.fabric as string) || "Premium Fabric",
    care: (data.care as string) || "Dry flat. Machine wash cold.",
    badge: (data.badge as "new" | "sale" | "bestseller" | undefined) ?? "new",
    rating: typeof data.rating === "number" ? data.rating : 5,
    reviews: typeof data.reviews === "number" ? data.reviews : 1,
    inStock: data.inStock !== false,
    createdAt,
    popularity: typeof data.popularity === "number" ? data.popularity : 80,
  };
}

let _cachedFirestoreProducts: Product[] = [];

/**
 * Asynchronously fetch a product by slug directly from Firestore.
 */
export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const docRef = doc(db, "products", slug);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const prod = firestoreDocToProduct(snap.id, snap.data() as Record<string, unknown>);
      // Update cache
      const existingIdx = _cachedFirestoreProducts.findIndex((p) => p.slug === slug);
      if (existingIdx >= 0) {
        _cachedFirestoreProducts[existingIdx] = prod;
      } else {
        _cachedFirestoreProducts.unshift(prod);
      }
      return prod;
    }
  } catch (err) {
    console.warn("fetchProductBySlug error:", err);
  }
  return staticProducts.find((p) => p.slug === slug);
}

/**
 * Initialize background Firestore listener. Safe for SSR (no-op on server).
 */
export function initFirestoreProductsListener() {
  if (typeof window === "undefined") return;

  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    onSnapshot(
      q,
      (snap) => {
        _cachedFirestoreProducts = snap.docs.map((doc) =>
          firestoreDocToProduct(doc.id, doc.data() as Record<string, unknown>),
        );
      },
      (err) => {
        console.warn("Firestore products background listener error:", err);
      },
    );
  } catch (err) {
    console.warn("Could not start Firestore listener:", err);
  }
}

/**
 * Synchronous cached lookup
 */
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
 * Hook to retrieve all products (combining Firestore dynamic + static catalog).
 */
export function useAllProducts() {
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>(_cachedFirestoreProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      unsub = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) =>
            firestoreDocToProduct(d.id, d.data() as Record<string, unknown>),
          );
          _cachedFirestoreProducts = items;
          setFirestoreProducts(items);
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore products hook listener error:", err);
          setLoading(false);
        },
      );
    } catch (e) {
      console.warn("Error subscribing to Firestore products:", e);
      setLoading(false);
    }

    return () => unsub();
  }, []);

  const merged = (() => {
    const firestoreSlugs = new Set(firestoreProducts.map((p) => p.slug));
    const kept = staticProducts.filter((p) => !firestoreSlugs.has(p.slug));
    return [...firestoreProducts, ...kept];
  })();

  return { products: merged, loading };
}
