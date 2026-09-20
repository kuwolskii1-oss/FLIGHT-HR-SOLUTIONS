/* Typed access to the JSON content files. The JSON is authored from the research dossier
 * (docs/research) and validated against site/content-brief/CONTENT-SCHEMA.md.
 * One module per file (./data) so a page only bundles the content it renders. Components and
 * routes import those modules directly (a shared barrel would pull every file into the entry
 * chunk); this barrel only remains as a map of what exists. */
export { site } from "./data/site";
export { home } from "./data/home";
export { services, findService } from "./data/services";
export { engines, findFamily } from "./data/engines";
export { industries, findIndustry } from "./data/industries";
export { about } from "./data/about";
export { assets } from "./data/assets";
export { contact } from "./data/contact";
export { careers } from "./data/careers";
export { legal } from "./data/legal";
export { glossary } from "./data/glossary";
export { insights, findArticle, sortedArticles } from "./data/insights";
