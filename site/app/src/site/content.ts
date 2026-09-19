/* Typed access to the JSON content files. The JSON is authored from the research dossier
 * (docs/research) and validated against site/content-brief/CONTENT-SCHEMA.md. */
import siteJson from "@/content/site.json";
import homeJson from "@/content/home.json";
import servicesJson from "@/content/services.json";
import enginesJson from "@/content/engines.json";
import industriesJson from "@/content/industries.json";
import aboutJson from "@/content/about.json";
import assetsJson from "@/content/assets.json";
import contactJson from "@/content/contact.json";
import careersJson from "@/content/careers.json";
import legalJson from "@/content/legal.json";
import glossaryJson from "@/content/glossary.json";
import insightsJson from "@/content/insights.json";
import type {
  AboutContent,
  AssetsContent,
  CareersContent,
  ContactContent,
  EnginesContent,
  GlossaryContent,
  HomeContent,
  IndustriesContent,
  InsightsContent,
  LegalContent,
  ServicesContent,
  SiteContent,
} from "./types";

export const site = siteJson as unknown as SiteContent;
export const home = homeJson as unknown as HomeContent;
export const services = servicesJson as unknown as ServicesContent;
export const engines = enginesJson as unknown as EnginesContent;
export const industries = industriesJson as unknown as IndustriesContent;
export const about = aboutJson as unknown as AboutContent;
export const assets = assetsJson as unknown as AssetsContent;
export const contact = contactJson as unknown as ContactContent;
export const careers = careersJson as unknown as CareersContent;
export const legal = legalJson as unknown as LegalContent;
export const glossary = glossaryJson as unknown as GlossaryContent;
export const insights = insightsJson as unknown as InsightsContent;

export const findService = (slug: string) => services.services.find((s) => s.slug === slug);
export const findFamily = (slug: string) => engines.families.find((f) => f.slug === slug);
export const findIndustry = (slug: string) => industries.industries.find((i) => i.slug === slug);
export const findArticle = (slug: string) => insights.articles.find((a) => a.slug === slug);
export const sortedArticles = () =>
  [...insights.articles].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
