/* Content types mirroring site/content-brief/CONTENT-SCHEMA.md. Optional where writers may vary. */
export interface Cta {
  label: string;
  href: string;
  kind?: "primary" | "secondary" | "link";
}
export interface Faq {
  q: string;
  a: string;
}
export interface Row {
  title: string;
  text: string;
  href: string;
  meta?: string[];
}
export interface Stat {
  value: string;
  unit?: string;
  label: string;
  source?: string;
}
export interface ImageRef {
  src: string;
  alt: string;
  credit?: string;
}
export interface LinkItem {
  label: string;
  href: string;
}
export interface SiteContent {
  company: {
    legalName: string;
    shortName: string;
    tagline: string;
    uid: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    phoneDisplay: string;
    email: string;
    whatsapp?: string;
    linkedin?: string;
    founded: string;
    managingDirector: string;
    registerUrl?: string;
  };
  nav: { primary: LinkItem[]; secondary: LinkItem[] };
  cta: { primary: Cta; secondary: Cta };
  memberships: { name: string; status: "verified" | "claimed"; since?: string; url?: string; source?: string }[];
  engineFamilies: { slug: string; name: string; models: string[] }[];
  languages?: { current: string; planned?: string[] };
  footer: { legalLine: string; disclosure: string };
}
export interface Chapter {
  id: string;
  label: string;
  kicker?: string;
  title: string;
  body: string;
  tags?: string[];
}
export interface HomeContent {
  hero: { headline: string; sub: string; metaLine?: string[]; ctas: Cta[] };
  chapters: Chapter[];
  proof: { stats: Stat[]; memberships?: string[] };
  situations: { title: string; items: { title: string; text: string; href: string }[] };
  services: { title: string; intro?: string; rows: Row[] };
  engines: { title: string; intro?: string; rows: Row[] };
  process: { title: string; intro?: string; steps: { n: string; title: string; text: string }[] };
  independence: { title: string; text: string; href: string };
  people: { title: string; intro: string; href: string };
  insights: { title: string; href: string };
  closing: { headline: string; sub?: string; ctas: Cta[] };
  faq?: Faq[];
}
export interface Service {
  slug: string;
  name: string;
  shortName?: string;
  oneLiner: string;
  seoTitle: string;
  metaDescription: string;
  keywords?: string[];
  audience?: string[];
  problem: { title: string; text: string; stats?: Stat[] };
  deliverables: { title: string; text: string }[];
  engagement: { n: string; title: string; text: string }[];
  engineFamilies?: string[];
  proof?: { title: string; text: string };
  faq?: Faq[];
  related?: string[];
  image?: ImageRef;
  cta?: Cta;
}
export interface ServicesContent {
  hub: { title: string; intro: string; situations?: { title: string; text: string; serviceSlugs: string[] }[] };
  services: Service[];
}
export interface EngineFamily {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  keywords?: string[];
  models: string[];
  context: { title: string; text: string; stats?: Stat[] };
  visitTypes?: { title: string; text: string }[];
  costDrivers?: { title: string; text: string }[];
  whatWeDo: { title: string; text: string; serviceSlug?: string }[];
  faq?: Faq[];
  image?: ImageRef;
  cta?: Cta;
}
export interface EnginesContent {
  hub: { title: string; intro: string };
  families: EngineFamily[];
}
export interface Industry {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  audience: string;
  situation: string;
  whatWeDo: { title: string; text: string; serviceSlug?: string }[];
  entryCta?: Cta;
  image?: ImageRef;
}
export interface IndustriesContent {
  hub: { title: string; intro: string };
  industries: Industry[];
}
export interface AboutContent {
  seoTitle: string;
  metaDescription: string;
  story: { title: string; paragraphs: string[] };
  independence: { title: string; statement: string; policy: string[] };
  team: { title: string; intro?: string; people: { name: string; role: string; text: string; languages?: string[]; linkedin?: string }[] };
  credentials: { title: string; items: { name: string; status: string; text: string; url?: string }[] };
  zug: { title: string; text: string; image?: ImageRef };
  legal: { title: string; lines: string[] };
}
export interface AssetsContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  disclosure: string;
  howItWorks: { n: string; title: string; text: string }[];
  recentActivity?: { date: string; type: string; item: string; text: string; source?: string }[];
  requestForm?: { title: string; text: string; fields: FormField[] };
  cta?: Cta;
}
export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  hint?: string;
}
export interface ContactContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  form: {
    title: string;
    responsePromise: string;
    fields: FormField[];
    consentText: string;
    submitLabel: string;
    successTitle: string;
    successText: string;
  };
  channels: { label: string; value: string; href: string; note?: string }[];
  urgent?: { title: string; text: string };
  office?: { title: string; lines: string[] };
}
export interface CareersContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  whatWeLookFor: string[];
  howToApply: { title: string; text: string; email: string };
  openRoles?: { title: string; location: string; text: string }[];
}
export interface LegalContent {
  impressum: { title: string; sections: { title: string; lines: string[] }[] };
  privacy: { title: string; updated: string; sections: { title: string; paragraphs: string[] }[] };
  cookies: { title: string; sections: { title: string; paragraphs: string[] }[] };
}
export interface GlossaryContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  terms: { term: string; definition: string; related?: string[] }[];
}
export interface Article {
  slug: string;
  title: string;
  date: string;
  readingMinutes?: number;
  excerpt: string;
  tags?: string[];
  sections: { heading: string; paragraphs: string[] }[];
  sources?: string[];
  image?: ImageRef;
}
export interface InsightsContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  articles: Article[];
}
