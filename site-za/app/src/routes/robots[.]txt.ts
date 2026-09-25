import { createFileRoute } from "@tanstack/react-router";
import { INDEXABLE } from "@/site/config";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        // While the site is in review it asks not to be indexed; flip INDEXABLE at launch.
        const body = INDEXABLE
          ? ["User-agent: *", "Allow: /", "Disallow: /app", "", `Sitemap: ${origin}/sitemap.xml`].join("\n")
          : ["User-agent: *", "Disallow: /", "", `Sitemap: ${origin}/sitemap.xml`].join("\n");
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
