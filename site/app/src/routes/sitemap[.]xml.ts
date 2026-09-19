import { createFileRoute } from "@tanstack/react-router";
import { engines, industries, insights, services } from "@/site/content";

const STATIC: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/engines", priority: "0.8", changefreq: "monthly" },
  { path: "/industries", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/assets", priority: "0.6", changefreq: "weekly" },
  { path: "/insights", priority: "0.7", changefreq: "weekly" },
  { path: "/glossary", priority: "0.5", changefreq: "monthly" },
  { path: "/careers", priority: "0.4", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
  { path: "/impressum", priority: "0.2", changefreq: "yearly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/cookies", priority: "0.2", changefreq: "yearly" },
];

export function sitemapPaths() {
  return [
    ...STATIC,
    ...services.services.map((s) => ({ path: `/services/${s.slug}`, priority: "0.8", changefreq: "monthly" })),
    ...engines.families.map((f) => ({ path: `/engines/${f.slug}`, priority: "0.7", changefreq: "monthly" })),
    ...industries.industries.map((i) => ({ path: `/industries/${i.slug}`, priority: "0.6", changefreq: "monthly" })),
    ...insights.articles.map((a) => ({ path: `/insights/${a.slug}`, priority: "0.6", changefreq: "yearly" })),
  ];
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];
        const urls = sitemapPaths()
          .map(
            (r) =>
              `  <url>\n    <loc>${origin}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
