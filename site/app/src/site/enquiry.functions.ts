import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import siteJson from "@/content/site.json";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(1).max(160),
  role: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional().default(""),
  engineFamily: z.string().trim().max(80).optional().default(""),
  need: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  // Honeypot: real visitors never fill this in.
  website: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/**
 * Receives a contact enquiry. When an email provider key is configured (RESEND_API_KEY, plus
 * optional ENQUIRY_TO and ENQUIRY_FROM secrets in the hosting settings) the enquiry is emailed
 * to the company; otherwise the client falls back to a prepared email draft.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    // The Cloudflare bindings module is loaded only when the handler runs on the Worker, so the
    // route that renders the form also works in local development, where the module does not exist.
    const { bindings } = await import("@/lib/bindings.server");
    const env = bindings() as unknown as Record<string, string | undefined>;
    const apiKey = env.RESEND_API_KEY;
    const to = env.ENQUIRY_TO ?? siteJson.company.email;
    const from = env.ENQUIRY_FROM ?? "Website <onboarding@resend.dev>";
    if (!apiKey) {
      return { ok: false as const, mode: "mailto" as const };
    }
    const lines = [
      `Name: ${data.name}`,
      `Company: ${data.company}`,
      data.role ? `Role: ${data.role}` : "",
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : "",
      data.engineFamily ? `Engine family: ${data.engineFamily}` : "",
      data.need ? `Need: ${data.need}` : "",
      "",
      data.message,
    ].filter(Boolean);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Website enquiry from ${data.name} (${data.company})`,
        text: lines.join("\n"),
        html: `<pre style="font: 14px/1.5 ui-monospace, monospace">${escapeHtml(lines.join("\n"))}</pre>`,
      }),
    });
    if (!res.ok) {
      console.error("enquiry: email provider returned", res.status);
      return { ok: false as const, mode: "mailto" as const };
    }
    return { ok: true as const, mode: "sent" as const };
  });
