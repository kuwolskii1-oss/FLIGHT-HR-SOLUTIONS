/* Generated illustration set (Higgsfield, September 2026). Real photography replaces these at
 * launch; keep the keys stable so content files do not change. */
export interface SiteImage {
  key: string;
  w: number;
  h: number;
  alt: string;
}
const RATIO_3x2 = { w: 1800, h: 1208 };
const RATIO_16x9 = { w: 1800, h: 1005 };
export const IMAGES: Record<string, SiteImage> = {
  "hero-engine-stand": { key: "hero-engine-stand", ...RATIO_16x9, alt: "High-bypass turbofan engine on a maintenance stand in a dark hangar" },
  "shop-floor": { key: "shop-floor", ...RATIO_3x2, alt: "Engine overhaul shop with several turbofan engines on stands" },
  borescope: { key: "borescope", ...RATIO_3x2, alt: "Gloved hands guiding a borescope probe into an engine inspection port" },
  "table-inspection": { key: "table-inspection", ...RATIO_3x2, alt: "Turbine blades laid out in rows on a white inspection table" },
  "test-cell": { key: "test-cell", ...RATIO_16x9, alt: "Turbofan engine mounted in a test cell" },
  "records-desk": { key: "records-desk", ...RATIO_3x2, alt: "Engine record binders, a logbook and a caliper on a desk" },
  "fan-macro": { key: "fan-macro", ...RATIO_3x2, alt: "Close view of turbofan fan blades and spinner" },
  "zug-lake": { key: "zug-lake", ...RATIO_3x2, alt: "Lake Zug at dawn with the old town and the Rigi behind" },
  "apron-dusk": { key: "apron-dusk", ...RATIO_3x2, alt: "Narrow-body airliner on a maintenance apron at dusk with an engine cowl open" },
  "engine-cradle": { key: "engine-cradle", ...RATIO_3x2, alt: "Covered turbofan engine secured in a shipping cradle" },
  "cross-section": { key: "cross-section", ...{ w: 1800, h: 1018 }, alt: "Line drawing of a turbofan engine in cross section" },
};
export function imageSources(key: string) {
  return {
    src: `/assets/img/${key}-900.webp`,
    srcSet: `/assets/img/${key}-900.webp 900w, /assets/img/${key}-1800.webp 1800w`,
  };
}
