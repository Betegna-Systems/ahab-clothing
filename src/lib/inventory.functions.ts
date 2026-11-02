import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getVariantAvailability = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({}).strict().parse(data))
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("product_variant_inventory")
      .select("product_slug, color, size")
      .gt("quantity", 0);

    if (error) throw error;

    return data;
  });

export const getProductVariantAvailability = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z.object({ productSlug: z.string().regex(/^[a-z0-9-]{1,120}$/) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: variants, error } = await supabaseAdmin
      .from("product_variant_inventory")
      .select("color, size")
      .eq("product_slug", data.productSlug)
      .gt("quantity", 0);

    if (error) throw error;

    return variants;
  });
