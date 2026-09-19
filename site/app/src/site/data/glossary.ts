import glossaryJson from "@/content/glossary.json";
import type { GlossaryContent } from "../types";

export const glossary = glossaryJson as unknown as GlossaryContent;
