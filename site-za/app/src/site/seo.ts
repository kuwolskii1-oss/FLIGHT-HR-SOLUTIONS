import { DEFAULT_OG_IMAGE, INDEXABLE, SITE_NAME, SITE_URL } from "./config";

export interface PageHeadOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
}

/** Builds the per-route head (title, description, canonical, Open Graph, Twitter, robots). */
export function pageHead(o: PageHeadOptions) {
  const url = `${SITE_URL}${o.path === "/" ? "" : o.path}`;
  const image = `${SITE_URL}${o.image ?? DEFAULT_OG_IMAGE}`;
  const title = o.path === "/" ? o.title : `${o.title} | ${SITE_NAME}`;
  const robots = INDEXABLE && !o.noindex ? "index, follow, max-image-preview:large" : "noindex, nofollow";
  return {
    meta: [
      { title },
      { name: "description", content: o.description },
      { name: "robots", content: robots },
      { property: "og:title", content: title },
      { property: "og:description", content: o.description },
      { property: "og:type", content: o.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: o.description },
      { name: "twitter:image", content: image },
      ...(o.publishedTime ? [{ property: "article:published_time", content: o.publishedTime }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
