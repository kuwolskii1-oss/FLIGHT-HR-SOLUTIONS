import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import siteJson from "@/content/site.json";

/** The role inboxes the forms route to. Keys match site.json company.emails. */
export const ROUTE_KEYS = ["general", "engines", "aircraft", "parts", "aog", "charter", "advisory"] as const;
export type RouteKey = (typeof ROUTE_KEYS)[number];

const payloadSchema = z.object({
  formId: z.string().trim().min(1).max(60),
  formTitle: z.string().trim().min(1).max(120),
  route: z.enum(ROUTE_KEYS),
  /** Label to value, in the order the form rendered them. */
  lines: z.array(z.tuple([z.string().trim().min(1).max(80), z.string().trim().max(4000)])).max(40),
  replyTo: z.string().trim().email().max(200),
  consent: z.literal(true),
  // Honeypot: real visitors never fill this in.
  website: z.string().max(0).optional().default(""),
});

export type EnquiryPayload = z.input<typeof payloadSchema>;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/**
 * Receives a form from any door. When an email provider key is configured in the hosting
 * secrets (RESEND_API_KEY, optional ENQUIRY_FROM, and optional per-route overrides such as
 * ENQUIRY_TO_PARTS) the request is emailed to that door's inbox; otherwise the client falls
 * back to a prepared email draft. Secret values never live in this repository.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => payloadSchema.parse(data))
  .handler(async ({ data }) => {
    const { bindings } = await import("@/lib/bindings.server");
    const env = bindings() as unknown as Record<string, string | undefined>;
    const apiKey = env.RESEND_API_KEY;
    const emails = siteJson.company.emails as Record<string, string>;
    const to = env[`ENQUIRY_TO_${data.route.toUpperCase()}`] ?? env.ENQUIRY_TO ?? emails[data.route] ?? emails.general;
    const from = env.ENQUIRY_FROM ?? "Website <onboarding@resend.dev>";
    if (!apiKey) return { ok: false as const, mode: "mailto" as const };
    const text = data.lines.map(([k, v]) => `${k}: ${v || "(empty)"}`).join("\n");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.replyTo,
        subject: `${data.formTitle} (website)`,
        text,
        html: `<pre style="font: 14px/1.5 ui-monospace, monospace">${escapeHtml(text)}</pre>`,
      }),
    });
    if (!res.ok) {
      console.error("enquiry: email provider returned", res.status);
      return { ok: false as const, mode: "mailto" as const };
    }
    return { ok: true as const, mode: "sent" as const };
  });
