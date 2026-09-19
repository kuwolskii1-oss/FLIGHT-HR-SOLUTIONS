import enginesJson from "@/content/engines.json";
import type { EnginesContent } from "../types";

export const engines = enginesJson as unknown as EnginesContent;

export const findFamily = (slug: string) => engines.families.find((f) => f.slug === slug);
