import industriesJson from "@/content/industries.json";
import type { IndustriesContent } from "../types";

export const industries = industriesJson as unknown as IndustriesContent;

export const findIndustry = (slug: string) => industries.industries.find((i) => i.slug === slug);
