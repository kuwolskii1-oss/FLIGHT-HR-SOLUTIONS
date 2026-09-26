import type { PictogramName } from "@/components/site/Pictogram";
import { about } from "@/site/data/about";
import { advisory } from "@/site/data/advisory";
import { aircraft } from "@/site/data/aircraft";
import { charter } from "@/site/data/charter";
import { contact } from "@/site/data/contact";
import { engine360 } from "@/site/data/engine360";
import { engines } from "@/site/data/engines";
import { legal } from "@/site/data/legal";
import { parts } from "@/site/data/parts";
import { site } from "@/site/data/site";
import type { Door, Form } from "@/site/types";
import { DOOR_PICTO, SECTION_PICTO } from "@/site/wayfinding";

/**
 * The header search's index (SiteSearch.tsx, search/ui.ts). Pure: it reads the content modules
 * and returns one entry per place a visitor can land on, a page or a section with an id. Nothing
 * here is new copy: every title, page name and word comes from the content JSON. It is imported
 * lazily on the first open, so it sits in its own chunk.
 */
export type Entry = {
  /** Site path, with the section's id as the hash. */
  href: string;
  title: string;
  /** The page the entry is on, shown as the result's quiet second line. */
  page: string;
  /** A page's own entry shows this on the second line instead of repeating its name. */
  sub?: string;
  /** A short label shown as a badge after the title, as in the menu ("Early access"). */
  note?: string;
  text?: string;
  keywords?: string[];
  icon?: PictogramName;
  /** Order in the list shown for an empty query (the five doors, the AOG line, contact). */
  suggest?: number;
};

const DOORS: Door[] = [engines, aircraft, parts, charter, advisory];

/** "Aircraft parts, verified before you pay | Flight Hour Solution" to its first part. */
const lead = (seoTitle: string) => seoTitle.split(" | ")[0].trim();
const words = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ");
/** A form is found by its fields and its button, and by the word the placeholder promises. */
const formWords = (form: Form) => [...form.fields.map((f) => f.label), form.submitLabel, "form"];

export function buildSearchEntries(): Entry[] {
  const byHref = new Map<string, Entry>();

  /** The first entry for an href keeps its title; later ones add their words to it. */
  const add = (e: Entry) => {
    const prev = byHref.get(e.href);
    if (!prev) {
      byHref.set(e.href, { ...e, keywords: [...new Set(e.keywords ?? [])] });
      return;
    }
    const extra = [e.title, ...(e.keywords ?? [])].filter((k) => k && k !== prev.title);
    prev.keywords = [...new Set([...(prev.keywords ?? []), ...extra])];
    prev.text = words(prev.text, e.text) || undefined;
    prev.sub ??= e.sub;
    prev.note ??= e.note;
    prev.icon ??= e.icon;
    prev.suggest ??= e.suggest;
  };

  const { nav, cta } = site;
  const aboutName = nav.about.label;
  const contactName = nav.contact.label;
  const legalGroup = site.footer.groups.find((g) => g.links.some((l) => l.href === "/privacy"));
  const legalName = legalGroup?.title ?? legal.legal.title;

  // 1. The five doors, in the menu's order (also the start of the empty-query list).
  nav.doors.forEach((d, i) => {
    const slug = d.href.replace(/^\//, "");
    const door = DOORS.find((x) => x.slug === slug);
    add({
      href: d.href,
      title: d.label,
      page: d.label,
      sub: door ? lead(door.seoTitle) : undefined,
      text: door ? words(door.hero.headline, door.hero.sub) : undefined,
      keywords: door ? [...door.who, ...door.bring] : undefined,
      icon: DOOR_PICTO[slug],
      suggest: i + 1,
    });
  });

  // 2. The urgent line and contact, the rest of the empty-query list.
  add({
    href: cta.urgent.href,
    title: cta.urgent.label,
    page: contactName,
    text: contact.urgent.text,
    keywords: [contact.urgent.title],
    icon: "alarm-bell",
    suggest: nav.doors.length + 1,
  });
  add({
    href: nav.contact.href,
    title: contactName,
    page: contactName,
    sub: contact.title,
    text: contact.intro,
    keywords: contact.channels.map((c) => c.note ?? c.label),
    icon: DOOR_PICTO.contact,
    suggest: nav.doors.length + 2,
  });

  // 3. The menu's section links: their labels are the titles visitors already know.
  for (const g of [...nav.doors, nav.about]) {
    for (const item of g.items) {
      const [path, hash] = item.href.split("#");
      const slug = path.replace(/^\//, "");
      add({
        href: item.href,
        title: item.label,
        page: g.label,
        note: item.note,
        icon: hash ? SECTION_PICTO[hash] : DOOR_PICTO[slug.split("/").pop() ?? ""],
      });
    }
  }

  // 4. Each door's own sections, process, checks, scope, viewer and form.
  for (const door of DOORS) {
    const base = `/${door.slug}`;
    const icon = DOOR_PICTO[door.slug];
    for (const s of door.sections) {
      add({
        href: `${base}#${s.id}`,
        title: s.title,
        page: door.name,
        text: s.text,
        keywords: s.bullets,
        icon: SECTION_PICTO[s.id] ?? icon,
      });
    }
    if (door.viewer) {
      add({
        href: `${base}#${door.viewer.id}`,
        title: door.viewer.title,
        page: door.name,
        text: door.viewer.intro,
        keywords: door.viewer.families.map((f) => f.name),
        icon: "settings",
      });
    }
    if (door.process) {
      add({
        href: `${base}#process`,
        title: door.process.title,
        page: door.name,
        text: words(door.process.intro, ...door.process.steps.map((s) => s.text)),
        keywords: door.process.steps.map((s) => s.title),
        icon: "stairs",
      });
    }
    if (door.verify) {
      add({
        href: `${base}#verify`,
        title: door.verify.title,
        page: door.name,
        text: words(door.verify.intro, ...door.verify.items.map((s) => s.text)),
        keywords: door.verify.items.map((s) => s.title),
        icon: "search",
      });
    }
    if (door.fullScope) {
      add({
        href: `${base}#scope`,
        title: door.fullScope.title,
        page: door.name,
        text: door.fullScope.intro,
        keywords: door.fullScope.groups.flatMap((g) => [g.title, ...g.items]),
        icon,
      });
    }
    add({
      href: `${base}#form`,
      title: door.form.title,
      page: door.name,
      text: words(door.form.intro, door.form.responsePromise),
      keywords: formWords(door.form),
      icon: "paper",
    });
  }

  // 5. About.
  add({
    href: nav.about.href,
    title: aboutName,
    page: aboutName,
    sub: about.intro.headline,
    text: about.intro.sub,
    icon: DOOR_PICTO.about,
  });
  add({
    href: "/about#how",
    title: about.how.title,
    page: aboutName,
    text: words(about.how.intro, ...about.how.steps.map((s) => s.text)),
    keywords: about.how.steps.map((s) => s.title),
    icon: "stairs",
  });
  add({
    href: "/about#serve",
    title: about.serve.title,
    page: aboutName,
    text: about.serve.intro,
    keywords: about.serve.groups.flatMap((g) => [g.title, ...g.items]),
    icon: "meeting-point",
  });
  add({
    href: "/about#commitments",
    title: about.commitments.title,
    page: aboutName,
    text: words(...about.commitments.items.map((s) => s.text)),
    keywords: about.commitments.items.map((s) => s.title),
    icon: "police",
  });
  add({
    href: "/about#team",
    title: about.team.title,
    page: aboutName,
    text: about.team.intro,
    keywords: about.team.people.flatMap((p) => [p.name, p.role]),
    icon: "conference-room",
  });
  add({
    href: "/about#company",
    title: about.company.title,
    page: aboutName,
    keywords: about.company.lines,
    icon: "passports",
  });
  add({
    href: "/about#group",
    title: about.group.title,
    page: aboutName,
    text: about.group.text,
    keywords: [site.group.swiss.label],
    icon: "globe",
  });

  // 6. Contact's form.
  add({
    href: "/contact#form",
    title: contact.general.title,
    page: contactName,
    text: contact.general.intro,
    keywords: formWords(contact.general),
    icon: "send",
  });

  // 7. Engine 360 (its menu entry above keeps the title and places it under Engines).
  const e360Item = nav.doors.flatMap((d) => d.items).find((i) => i.href.includes("engine-360"));
  const e360Href = e360Item?.href ?? "/engines/engine-360";
  const e360Name = e360Item?.label ?? engine360.badge;
  add({
    href: e360Href,
    title: e360Name,
    page: nav.doors.find((d) => d.items.some((i) => i.href === e360Href))?.label ?? e360Name,
    sub: engine360.headline,
    text: words(engine360.sub, engine360.status),
    keywords: [engine360.badge, ...engine360.what.map((w) => w.title)],
    icon: "settings",
  });
  add({
    href: `${e360Href}#form`,
    title: engine360.form.title,
    page: e360Name,
    text: engine360.form.intro,
    keywords: formWords(engine360.form),
    icon: "paper",
  });

  // 8. Privacy and legal, and the footer's links into the legal page.
  add({
    href: "/privacy",
    title: legal.privacy.title,
    page: legalName,
    sub: legal.privacy.intro,
    keywords: legal.privacy.sections.map((s) => s.title),
    icon: "fingerprint-scan",
  });
  add({
    href: "/legal",
    title: legal.legal.title,
    page: legalName,
    sub: legal.legal.intro,
    keywords: legal.legal.sections.map((s) => s.title),
    icon: "passports",
  });
  for (const link of legalGroup?.links ?? []) {
    // The privacy notice's link only adds its note ("POPIA") to the entry above.
    const section = legal.legal.sections.find((s) => s.title === link.label);
    add({
      href: link.href,
      title: link.label,
      page: legalName,
      text: section?.paragraphs[0],
      keywords: link.note ? [link.note] : undefined,
      icon: "paper",
    });
  }

  // Anything still without a pictogram takes its page's.
  const all = [...byHref.values()];
  for (const e of all) e.icon ??= DOOR_PICTO[e.href.split("#")[0].split("/").filter(Boolean)[0] ?? ""];
  return all;
}
