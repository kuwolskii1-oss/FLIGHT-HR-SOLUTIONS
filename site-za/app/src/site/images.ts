/* Placeholder imagery. Seven images are the Swiss site's generated illustrations (shared brand
 * world); three were generated for the South African doors. Real photography replaces them at
 * launch; keep the keys stable so pages do not change. All files are WebP at 900 and 1800 px. */
export interface SiteImage {
  key: string;
  w: number;
  h: number;
  alt: string;
}
const R3x2 = { w: 1800, h: 1208 };
const R16x9 = { w: 1800, h: 1013 };
export const IMAGES: Record<string, SiteImage> = {
  "hero-engine-stand": { key: "hero-engine-stand", ...R16x9, alt: "High-bypass turbofan engine on a maintenance stand in a dark hangar" },
  borescope: { key: "borescope", ...R3x2, alt: "Gloved hands guiding a borescope probe into an engine inspection port" },
  "table-inspection": { key: "table-inspection", ...R3x2, alt: "Turbine blades laid out in rows on a white inspection table" },
  "records-desk": { key: "records-desk", ...R3x2, alt: "Engine record binders, a logbook and a caliper on a desk" },
  "apron-dusk": { key: "apron-dusk", ...R3x2, alt: "Narrow-body airliner on a maintenance apron at dusk with an engine cowl open" },
  "engine-cradle": { key: "engine-cradle", ...R3x2, alt: "Covered turbofan engine secured in a shipping cradle" },
  "cross-section": { key: "cross-section", ...{ w: 1800, h: 1018 }, alt: "Line drawing of a turbofan engine in cross section" },
  "charter-apron": { key: "charter-apron", ...R16x9, alt: "Business jet parked on a quiet apron at dusk with storm clouds in the distance" },
  "parts-store": { key: "parts-store", ...R16x9, alt: "Aircraft parts store with tagged components on steel shelving and an inspection bench" },
  "apron-dawn": { key: "apron-dawn", ...R16x9, alt: "Business jet on a maintenance apron at dawn with a stand and a ground power unit beside it" },
};
/** The image that opens each door page. */
export const DOOR_IMAGES: Record<string, string> = {
  engines: "hero-engine-stand",
  aircraft: "apron-dusk",
  parts: "parts-store",
  charter: "charter-apron",
  advisory: "records-desk",
};
export function imageSources(key: string) {
  return {
    src: `/assets/img/${key}-900.webp`,
    srcSet: `/assets/img/${key}-900.webp 900w, /assets/img/${key}-1800.webp 1800w`,
  };
}
