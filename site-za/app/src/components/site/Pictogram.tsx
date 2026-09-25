import data from "@/site/pictograms.json";

/**
 * Wayfinding pictograms from Streamline's "Guidance - Free" set (CC BY 4.0, credited in the
 * footer of every page), the set Streamline drew for signage and wayfinding. The bodies live in
 * src/site/pictograms.json, an Iconify-format subset; regenerate it with the streamline-icons
 * skill's script: node .claude/skills/streamline-icons/scripts/fetch-icons.mjs --iconify
 * -o site-za/app/src/site/pictograms.json guidance:<name> ... (keep under the free licence's
 * 50-icon cap). Guidance names arrows by the direction you walk away from: "left-arrow" is drawn
 * pointing right, so it is the forward arrow everywhere on this site.
 * Decorative by default (aria-hidden); pass `title` when the pictogram carries meaning on its own.
 */
export type PictogramName = keyof typeof data.icons;

type Icon = { body: string; width?: number; height?: number };

const escapeXml = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

export function Pictogram({
  name,
  size = 24,
  title,
  className = "",
}: {
  name: PictogramName;
  size?: number | string;
  title?: string;
  className?: string;
}) {
  const icon = (data.icons as Record<string, Icon>)[name];
  if (!icon) return null;
  const w = icon.width ?? data.width;
  const h = icon.height ?? data.height;
  return (
    <svg
      className={`c-picto ${className}`.trim()}
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      dangerouslySetInnerHTML={{
        __html: (title ? `<title>${escapeXml(title)}</title>` : "") + icon.body,
      }}
    />
  );
}

/** A pictogram in a solid tile, as on an airport sign. */
export function PictoTile({
  name,
  size = "md",
  className = "",
}: {
  name: PictogramName;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={`c-tile c-tile--${size} ${className}`.trim()} aria-hidden="true">
      <Pictogram name={name} size="100%" />
    </span>
  );
}
