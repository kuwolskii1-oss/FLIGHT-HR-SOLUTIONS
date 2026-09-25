import json from "@/content/site.json";
import type { SiteContent } from "../types";

export const site = json as unknown as SiteContent;
