import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the repo and read at
// BUILD time. Per-route head() calls override these defaults for every public page.
import appMetaJson from "../app-meta.json";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageTransition } from "@/components/site/PageTransition";
import { CtaLink } from "@/components/site/Cta";
import { INDEXABLE, SITE_NAME, SITE_URL, THEME_COLOR } from "@/site/config";

declare const __HF_DESIGN_INSPECTOR__: boolean;

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some((zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`));
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? SITE_NAME;
  const description = meta.og_description ?? "Engine management, aircraft and parts sourcing, and charter, from South Africa.";
  const ogImage = toOwnAssetUrl(meta.og_image_url) ?? "/og/home.jpg";
  const absoluteImage = ogImage.startsWith("/") ? `${SITE_URL}${ogImage}` : ogImage;
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: THEME_COLOR },
      { name: "robots", content: INDEXABLE ? "index, follow, max-image-preview:large" : "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_GB" },
      { property: "og:image", content: absoluteImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: absoluteImage },
    ],
    scripts: [
      // Arriving from another page of the site in a browser without cross-document view
      // transitions: start the same entrance (za.css, PageTransition.tsx). Runs before first paint.
      {
        children:
          "try{if(sessionStorage.getItem('fhs-nav')){sessionStorage.removeItem('fhs-nav');" +
          "if(!('onpagereveal' in window)&&!matchMedia('(prefers-reduced-motion: reduce)').matches)" +
          "document.documentElement.classList.add('is-arriving')}}catch(e){}",
      },
      {
        type: "speculationrules",
        children: JSON.stringify({ prefetch: [{ where: { and: [{ href_matches: "/*" }, { not: { href_matches: "/app*" } }] }, eagerness: "moderate" }] }),
      },
    ],
    links: [
      { rel: "preload", href: "/fonts/IBMPlexSans-400-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" as const },
      { rel: "preload", href: "/fonts/IBMPlexSans-500-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

function NotFoundComponent() {
  return (
    <main id="main" tabIndex={-1} data-theme="light" className="o-section c-notfound">
      <div className="o-container">
        <span className="c-eyebrow">404</span>
        <h1 className="c-h1 c-h1--inner">This page does not exist</h1>
        <p className="c-lead c-muted" style={{ marginTop: "var(--space-medium)" }}>
          The address may have changed. The pages below cover everything on the site.
        </p>
        <div className="c-cta-row" style={{ marginTop: "var(--space-large)" }}>
          <CtaLink href="/" label="Home" />
          <CtaLink href="/engines" label="Engines" />
          <CtaLink href="/contact" label="Contact" />
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <main id="main" tabIndex={-1} data-theme="light" className="o-section c-notfound">
      <div className="o-container">
        <h1 className="c-h1 c-h1--inner">This page did not load</h1>
        <p className="c-lead c-muted" style={{ marginTop: "var(--space-medium)" }}>
          Something went wrong on our side. You can try again or go back to the home page.
        </p>
        <div className="c-cta-row" style={{ marginTop: "var(--space-large)" }}>
          <button
            type="button"
            className="c-cta-talk"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <CtaLink href="/" label="Home" />
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="site">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }
    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(error instanceof Error ? error : new Error("Failed to load design inspector"), {
          boundary: "higgsfield_design_inspector_import",
        });
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <SiteFooter />
      <PageTransition />
    </QueryClientProvider>
  );
}
