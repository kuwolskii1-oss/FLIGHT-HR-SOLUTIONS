/** "2026-09-09" to "9 September 2026" (British English, UTC so the output never shifts by time zone). */
export function formatDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export const capitalise = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
