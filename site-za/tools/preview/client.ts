// The site's interactive modules for the no-login preview: the same code the pages mount in their
// effects (PartsViewer.tsx, SiteSearch.tsx), bundled once by build-preview.mjs (bun build, IIFE)
// and started by runtime.js on the preview's markup.
import { mountPartsViewer } from "../../app/src/site/parts/viewer";
import { mountPartsRequest } from "../../app/src/site/parts/request";
import { mountSiteSearch } from "../../app/src/site/search/ui";

(window as unknown as { FHSClient: unknown }).FHSClient = { mountPartsViewer, mountPartsRequest, mountSiteSearch };
