import { createFileRoute } from "@tanstack/react-router";
import { buildSitemapXml, getSiteOrigin } from "@/lib/seo";
import { fetchAllFirestoreProducts, getAllProductsCached } from "@/lib/firestore-products";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = getSiteOrigin(request);
        // Lists the live catalog (including pieces added in the admin app).
        await fetchAllFirestoreProducts();
        return new Response(buildSitemapXml(origin, getAllProductsCached()), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
