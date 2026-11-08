import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FeatureDatabase } from "@/lib/feature-database";
import type { Product } from "@/lib/products";

async function getFeatureAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient<FeatureDatabase>;
}

/**
 * Same rule placeOrder prices by: a variant is sellable only while its product is in the
 * catalog, marked available, and still offers that color and size. Without this, a product
 * switched off in the admin app would look buyable and then fail at checkout.
 */
function isSellable(product: Product | undefined, color: string, size: string) {
  return Boolean(
    product?.inStock &&
    product.colors.some((c) => c.name === color) &&
    product.sizes.includes(size),
  );
}

export const getVariantAvailability = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({}).strict().parse(data))
  .handler(async () => {
    const supabaseAdmin = await getFeatureAdmin();
    const { fetchAllFirestoreProducts, getAllProductsCached } =
      await import("@/lib/firestore-products");
    const [{ data, error }] = await Promise.all([
      supabaseAdmin
        .from("product_variant_inventory")
        .select("product_slug, color, size")
        .gt("quantity", 0),
      fetchAllFirestoreProducts(),
    ]);

    if (error) throw error;

    const catalog = new Map(getAllProductsCached().map((p) => [p.slug, p]));
    return data.filter((v) => isSellable(catalog.get(v.product_slug), v.color, v.size));
  });

export const getProductVariantAvailability = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z.object({ productSlug: z.string().regex(/^[a-z0-9-]{1,120}$/) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabaseAdmin = await getFeatureAdmin();
    const { fetchProductBySlug } = await import("@/lib/firestore-products");
    const [{ data: variants, error }, product] = await Promise.all([
      supabaseAdmin
        .from("product_variant_inventory")
        .select("color, size")
        .eq("product_slug", data.productSlug)
        .gt("quantity", 0),
      fetchProductBySlug(data.productSlug),
    ]);

    if (error) throw error;

    return variants.filter((v) => isSellable(product, v.color, v.size));
  });
