import { createFileRoute } from "@tanstack/react-router";
import { buildRobotsTxt, getSiteOrigin } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = getSiteOrigin(request);
        return new Response(buildRobotsTxt(origin), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
