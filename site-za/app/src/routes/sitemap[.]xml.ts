import { createFileRoute } from "@tanstack/react-router";

const STATIC: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/engines", priority: "0.9", changefreq: "monthly" },
  { path: "/engines/engine-360", priority: "0.6", changefreq: "monthly" },
  { path: "/aircraft", priority: "0.9", changefreq: "monthly" },
  { path: "/parts", priority: "0.9", changefreq: "monthly" },
  { path: "/charter", priority: "0.9", changefreq: "monthly" },
  { path: "/advisory", priority: "0.8", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/legal", priority: "0.2", changefreq: "yearly" },
];

export function sitemapPaths() {
  return STATIC;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];
        const urls = sitemapPaths()
          .map((r) => `  <url>\n    <loc>${origin}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
