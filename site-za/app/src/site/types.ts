/* Types inferred from the zod schemas in schema.ts. Edit the schemas, not this file. */
import type { z } from "zod";
import type * as S from "./schema";

export type Cta = z.infer<typeof S.Cta>;
export type LinkItem = z.infer<typeof S.LinkItem>;
export type Step = z.infer<typeof S.Step>;
export type Item = z.infer<typeof S.Item>;
export type ImageRef = z.infer<typeof S.ImageRef>;
export type FormField = z.infer<typeof S.FormField>;
export type Form = z.infer<typeof S.Form>;
export type SiteContent = z.infer<typeof S.SiteContent>;
export type HomeContent = z.infer<typeof S.HomeContent>;
export type Door = z.infer<typeof S.Door>;
export type Engine360Content = z.infer<typeof S.Engine360Content>;
export type AboutContent = z.infer<typeof S.AboutContent>;
export type ContactContent = z.infer<typeof S.ContactContent>;
export type LegalContent = z.infer<typeof S.LegalContent>;
