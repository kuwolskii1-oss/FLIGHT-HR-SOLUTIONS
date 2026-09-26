import type { CSSProperties } from "react";
import { ditherSources } from "@/site/images";

/**
 * An inner page intro's background: its photograph as a light dot-matrix dither (dither.css).
 * Decorative, a few kilobytes, no script: the grid is a tiny image scaled up pixel-exact and CSS
 * draws each cell as a dot. Only the grid for the current layout is downloaded.
 */
export function IntroDither({ image }: { image: string }) {
  const { d, m } = ditherSources(image);
  return (
    <div
      className="c-dither"
      aria-hidden="true"
      style={{ "--dither-d": `url(${d})`, "--dither-m": `url(${m})` } as CSSProperties}
    >
      <div className="c-dither__grid" />
    </div>
  );
}
