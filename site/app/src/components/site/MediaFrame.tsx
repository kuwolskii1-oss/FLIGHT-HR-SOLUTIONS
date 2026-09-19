import { IMAGES, imageSources } from "@/site/images";

export function MediaFrame({
  image,
  alt,
  ratio = "3x2",
  caption,
  priority,
  sizes = "(min-width: 1000px) 50vw, 100vw",
  tallMobile,
  className = "",
}: {
  image: string;
  alt?: string;
  ratio?: "3x2" | "16x9" | "4x5" | "1x1";
  caption?: string;
  priority?: boolean;
  sizes?: string;
  tallMobile?: boolean;
  className?: string;
}) {
  const meta = IMAGES[image];
  if (!meta) return null;
  const { src, srcSet } = imageSources(image);
  return (
    <figure className={className}>
      <div className={`c-media c-media--${ratio}${tallMobile ? " c-media--tall-mobile" : ""}`}>
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          width={meta.w}
          height={meta.h}
          alt={alt ?? meta.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      {caption ? <figcaption className="c-media__caption">{caption}</figcaption> : null}
    </figure>
  );
}
