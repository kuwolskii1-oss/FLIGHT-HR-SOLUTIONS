import { IMAGES, imageSources } from "@/site/images";

/**
 * A placed image: fixed ratio box, responsive sources, lazy by default. With `reveal` the
 * engine wipes it in as its act scrolls (clip-path, no layout work), settled under reduced motion.
 */
export function MediaFrame({ image, alt, ratio = "16x9", priority, sizes = "(min-width: 1000px) 60vw, 100vw", reveal, caption, className = "" }: { image: string; alt?: string; ratio?: "3x2" | "16x9" | "4x5" | "1x1"; priority?: boolean; sizes?: string; reveal?: "up" | "left" | "right" | "iris"; caption?: string; className?: string }) {
  const meta = IMAGES[image];
  if (!meta) return null;
  const src = imageSources(image);
  return (
    <figure className={`c-media c-media--${ratio} ${className}`.trim()} data-sc-reveal={reveal} data-sc-reveal-at={reveal ? "0.12 0.55" : undefined}>
      <img src={src.src} srcSet={src.srcSet} sizes={sizes} width={meta.w} height={meta.h} alt={alt ?? meta.alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />
      {caption ? <figcaption className="c-media__caption">{caption}</figcaption> : null}
    </figure>
  );
}
