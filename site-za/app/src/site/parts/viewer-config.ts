/**
 * UI configuration for the Parts engine viewer, shared by the server markup (PartsViewer.tsx) and
 * the DOM module (viewer.ts). Tiny on purpose: the page chunk imports it statically, while
 * viewer.ts and three.js stay in their own lazy chunks.
 */

/** Family index 0..3 sits at these camera azimuths (the inlet faces azimuth 0; 45 is front right). */
export const STOPS = [45, 135, 225, 315] as const;

export const POSTER_BASE = "/assets/img/parts-viewer/";

/**
 * The phone layout (parts-viewer.css switches at the same width): the tabs sit under the card and
 * the two turn buttons are round buttons in its bottom corners. viewer.ts reads this query rather
 * than the stage width, which is narrower than the viewport and would disagree with the CSS.
 */
export const PHONE_MEDIA = "(max-width: 699px)";
/** When the card shows the 4:5 poster: phones held upright. A phone on its side gets the wide set. */
export const POSTER_TALL_MEDIA = "(max-width: 699px) and (orientation: portrait)";

/**
 * The poster files for a family and its stop: the desktop set (2.35:1) and the phone set (4:5).
 * `base` lets viewer.ts reuse the folder of the poster the server rendered, so the files resolve
 * wherever the page is served from (the no-login preview serves them relatively).
 */
export const posterFiles = (key: string, az: number, base: string = POSTER_BASE) => ({
  wide1600: `${base}${key}-${az}-1600.webp`,
  wide800: `${base}${key}-${az}-800.webp`,
  tall800: `${base}${key}-${az}-tall-800.webp`,
});

/**
 * Where the callout anchor and the rig's bounds fall on each poster, as fractions of the image.
 * Written by the offline poster renderer from the same scene code, so the callout sits on the
 * engine when WebGL is unavailable.
 */
export type PosterStop = { ax: number; ay: number; l: number; t: number; r: number; b: number };
export const POSTERS: Record<"wide" | "tall", { w: number; h: number; stops: PosterStop[] }> = {
  wide: {
    w: 1600,
    h: 680,
    stops: [
      { ax: 0.327, ay: 0.1783, l: 0.3052, t: 0.1219, r: 0.6691, b: 0.7931 },
      { ax: 0.6281, ay: 0.2851, l: 0.334, t: 0.0904, r: 0.6956, b: 0.817 },
      { ax: 0.372, ay: 0.2851, l: 0.3046, t: 0.0907, r: 0.6661, b: 0.8105 },
      { ax: 0.6731, ay: 0.1783, l: 0.3318, t: 0.1216, r: 0.6949, b: 0.7905 },
    ],
  },
  tall: {
    w: 800,
    h: 1000,
    stops: [
      { ax: 0.1229, ay: 0.3157, l: 0.0733, t: 0.2726, r: 0.8756, b: 0.7704 },
      { ax: 0.7798, ay: 0.3947, l: 0.1319, t: 0.2467, r: 0.9297, b: 0.7873 },
      { ax: 0.2205, ay: 0.3947, l: 0.0706, t: 0.2467, r: 0.8682, b: 0.7827 },
      { ax: 0.8773, ay: 0.3157, l: 0.1264, t: 0.2723, r: 0.9271, b: 0.7685 },
    ],
  },
};
