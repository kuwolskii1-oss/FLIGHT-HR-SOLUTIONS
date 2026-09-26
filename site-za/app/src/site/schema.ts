/**
 * Content schema for the South African site (Flight Hour Solution (Pty) Ltd).
 * Single source of truth: the JSON under src/content is validated against these
 * schemas by site-za/tools/validate-content.mjs, and the TypeScript types in
 * types.ts are inferred from them.
 *
 * Every file may also carry three documentation keys that are stripped at
 * build time and never rendered: "notes", "sources" and "clientToConfirm".
 */
import { z } from "zod";

const str = z.string();
const short = z.string().min(1);

export const Cta = z.object({
  label: short,
  href: short,
  kind: z.enum(["primary", "secondary", "link"]).optional(),
});
export const LinkItem = z.object({ label: short, href: short, note: str.optional() });
export const Step = z.object({ n: short, title: short, text: short });
export const Item = z.object({ title: short, text: short, href: str.optional() });
export const ImageRef = z.object({ src: short, alt: str, credit: str.optional() });

export const FormField = z.object({
  name: short,
  label: short,
  type: z.enum(["text", "email", "tel", "number", "date", "select", "textarea", "radio", "segmented", "checkbox", "file"]),
  required: z.boolean().optional(),
  options: z.array(short).optional(),
  hint: str.optional(),
  placeholder: str.optional(),
  width: z.enum(["half", "full"]).optional(),
  /** Show only when another field has this value (for example AOG = Yes). */
  showWhen: z.object({ field: short, equals: short }).optional(),
});

export const Form = z.object({
  id: short,
  title: short,
  intro: str.optional(),
  fields: z.array(FormField).min(1),
  submitLabel: short,
  /** POPIA consent sentence shown with the checkbox. */
  consentText: short,
  /** Role inbox the request is routed to (proposed; the client confirms). */
  routeTo: short,
  currencyNote: str.optional(),
  /** Charter operator disclaimer or NDA line shown under the button. */
  disclaimer: str.optional(),
  responsePromise: str.optional(),
  successTitle: short,
  successText: short,
});

export const SiteContent = z.object({
  company: z.object({
    legalName: short,
    shortName: short,
    tagline: short,
    positioning: short,
    registrationNumber: short,
    /** Empty until the client supplies it; components omit the line. */
    address: z.array(str),
    phone: str,
    phoneDisplay: str,
    whatsapp: str,
    whatsappDisplay: str,
    emails: z.object({
      general: short,
      engines: short,
      aircraft: short,
      parts: short,
      aog: short,
      charter: short,
      advisory: short,
    }),
    founded: short,
    managingDirector: str,
    informationOfficer: str,
    country: short,
  }),
  group: z.object({
    line: short,
    relationship: str,
    swiss: z.object({ label: short, href: short, note: str.optional() }),
  }),
  nav: z.object({
    doors: z.array(z.object({ label: short, href: short, items: z.array(LinkItem) })).length(5),
    about: z.object({ label: short, href: short, items: z.array(LinkItem) }),
    contact: LinkItem,
  }),
  cta: z.object({ primary: Cta, urgent: Cta }),
  /** The header search (components/site/SiteSearch.tsx). */
  search: z.object({
    label: short,
    placeholder: short,
    button: short,
    close: short,
    suggestions: short,
    noResults: short,
    requestPart: short,
  }),
  hours: z.object({ aog: str, office: str, timezone: short }),
  currency: z.object({ assets: short, charter: short }),
  whatsappTemplates: z.object({ aog: short, charter: short }),
  /** The line under a form (and in the Parts request dialog) once "aircraft on ground" is Yes and
   * company.whatsapp is set: before, the link text, after. */
  aogWhatsApp: z.object({ before: short, link: short, after: short }),
  footer: z.object({
    legalLine: short,
    disclaimer: short,
    groups: z.array(z.object({ title: short, links: z.array(LinkItem) })),
    badges: z.array(z.object({ name: short, status: z.enum(["held", "to-confirm"]), text: str.optional() })),
  }),
});

export const HomeContent = z.object({
  hero: z.object({
    headline: short,
    sub: short,
    cta: Cta,
    secondary: Cta.optional(),
    /** Two checkable facts shown on glass over the hero photograph (value large, label small). */
    facts: z.array(z.object({ value: short, label: short })).max(2).optional(),
  }),
  ask: z.object({
    title: short,
    doors: z.array(z.object({ slug: short, title: short, text: short, href: short, urgency: short })).length(5),
  }),
  how: z.object({ title: short, intro: str.optional(), steps: z.array(Step).length(5), cta: Cta }),
  trust: z.object({ title: short, text: short, items: z.array(Item).min(2).max(4), cta: Cta.optional() }),
  engine360: z.object({ badge: short, title: short, text: short, cta: Cta }),
  group: z.object({ title: short, text: short, cta: Cta }),
  closing: z.object({ headline: short, sub: str.optional(), cta: Cta, urgent: Cta }),
});

export const Door = z.object({
  slug: z.enum(["engines", "aircraft", "parts", "charter", "advisory"]),
  name: short,
  seoTitle: short,
  metaDescription: short,
  hero: z.object({ headline: short, sub: short, cta: Cta }),
  who: z.array(short).min(1),
  urgency: short,
  bring: z.array(short).min(1),
  sections: z
    .array(z.object({ id: short, title: short, text: short, bullets: z.array(short).max(6).optional(), href: str.optional() }))
    .min(1),
  /** Parts only: the engine families viewer and its request dialog (components/site/PartsViewer.tsx). */
  viewer: z
    .object({
      id: short,
      title: short,
      intro: short,
      illustration: short,
      families: z.array(z.object({ key: short, name: short })).length(4),
      hint: short,
      prompt: short,
      promptContinue: short,
      requestTitle: short,
      steps: z.object({ parts: short, condition: short, aog: short }),
      addRow: short,
      removeRow: short,
      alsoIn: short,
      /** "1 part", "{n} parts": the step summary and the "Also in this request" counts. */
      partCount: z.object({ one: short, other: short.regex(/\{n\}/) }),
      next: short,
      back: short,
      finish: short,
      close: short,
      rowLimit: short,
      filled: short,
    })
    .optional(),
  process: z.object({ title: short, intro: str.optional(), steps: z.array(Step).min(3) }).optional(),
  verify: z.object({ title: short, intro: str.optional(), items: z.array(Item).min(3) }).optional(),
  fullScope: z.object({ title: short, intro: str.optional(), groups: z.array(z.object({ title: short, items: z.array(short) })) }).optional(),
  disclaimer: str.optional(),
  form: Form,
  related: z.array(LinkItem).optional(),
  image: ImageRef.optional(),
});

export const Engine360Content = z.object({
  seoTitle: short,
  metaDescription: short,
  badge: short,
  headline: short,
  sub: short,
  what: z.array(Item).min(2).max(5),
  status: short,
  form: Form,
});

export const AboutContent = z.object({
  seoTitle: short,
  metaDescription: short,
  intro: z.object({ headline: short, sub: short }),
  how: z.object({ title: short, intro: str.optional(), steps: z.array(Step).length(5) }),
  serve: z.object({ title: short, intro: str.optional(), groups: z.array(z.object({ title: short, items: z.array(short) })).min(2) }),
  commitments: z.object({ title: short, items: z.array(Item).min(2).max(6) }),
  team: z.object({
    title: short,
    intro: short,
    people: z.array(z.object({ name: short, role: short, text: short, basedIn: str.optional(), group: z.boolean().optional() })),
  }),
  company: z.object({ title: short, lines: z.array(short) }),
  group: z.object({ title: short, text: short, cta: Cta }),
});

export const ContactContent = z.object({
  seoTitle: short,
  metaDescription: short,
  title: short,
  intro: short,
  doors: z.array(z.object({ label: short, href: short, text: short })).length(5),
  urgent: z.object({ title: short, text: short, cta: Cta, hours: str }),
  channels: z.array(z.object({ label: short, value: short, href: short, note: str.optional() })),
  office: z.object({ title: short, lines: z.array(str) }),
  general: Form,
});

export const LegalContent = z.object({
  privacy: z.object({
    title: short,
    updated: short,
    intro: short,
    sections: z.array(z.object({ title: short, paragraphs: z.array(short), bullets: z.array(short).optional() })).min(4),
  }),
  legal: z.object({
    title: short,
    intro: str.optional(),
    sections: z.array(z.object({ title: short, paragraphs: z.array(short), lines: z.array(short).optional() })).min(3),
  }),
});

export const FILES = {
  "site.json": SiteContent,
  "home.json": HomeContent,
  "engines.json": Door,
  "aircraft.json": Door,
  "parts.json": Door,
  "charter.json": Door,
  "advisory.json": Door,
  "engine360.json": Engine360Content,
  "about.json": AboutContent,
  "contact.json": ContactContent,
  "legal.json": LegalContent,
} as const;
