/**
 * Scene data for the scroll-scrub journey. One continuous 15 second film of a turbofan engine on
 * its maintenance stand (generated from the approved storyboard, see design-brief.md) is cut into
 * five consecutive three-second clips, so every seam is a real adjacent frame of the same take.
 * Chapter copy comes from the content file and is rendered as semantic sections over the film.
 * Every poster is the exact first frame of the encoded clip beside it.
 */
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";
import homeJson from "@/content/home.json";

/** Brand tokens for the journey layer (design brief: navy canvas, white ink, orange signal). */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#ee7203",
  background: "#0c1022",
  ink: "#ffffff",
  muted: "#a9acc6",
};

const chapters = homeJson.chapters as {
  id: string;
  label: string;
  kicker?: string;
  title: string;
  body: string;
  tags?: string[];
}[];

const hero = homeJson.hero as { headline: string; sub: string; metaLine?: string[] };

export const scrollScrubScenes: ScrollScrubScene[] = chapters.slice(0, 5).map((chapter, index) => {
  const n = String(index + 1).padStart(2, "0");
  // The first chapter is the site's hero: it carries the brand statement and the metadata row.
  const first = index === 0;
  return {
    id: chapter.id,
    label: chapter.label,
    kicker: chapter.kicker,
    title: first ? hero.headline : chapter.title,
    body: first ? hero.sub : chapter.body,
    tags: first ? hero.metaLine : chapter.tags,
    align: "left",
    clip: `/assets/world/scene-${n}.mp4`,
    poster: `/assets/world/scene-${n}-poster.jpg`,
    mobileClip: `/assets/world/scene-${n}-mobile.mp4`,
    mobilePoster: `/assets/world/scene-${n}-mobile-poster.jpg`,
    scroll: index === 0 ? 1.6 : 1.3,
    linger: 0.12,
    objectPosition: "center center",
    mobileObjectPosition: "center 40%",
  };
});
