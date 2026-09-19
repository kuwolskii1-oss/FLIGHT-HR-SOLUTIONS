import insightsJson from "@/content/insights.json";
import type { InsightsContent } from "../types";

export const insights = insightsJson as unknown as InsightsContent;

export const findArticle = (slug: string) => insights.articles.find((a) => a.slug === slug);
export const sortedArticles = () =>
  [...insights.articles].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
