import servicesJson from "@/content/services.json";
import type { ServicesContent } from "../types";

export const services = servicesJson as unknown as ServicesContent;

export const findService = (slug: string) => services.services.find((s) => s.slug === slug);
