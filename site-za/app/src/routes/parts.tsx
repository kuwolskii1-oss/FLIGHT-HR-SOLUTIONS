import { createFileRoute } from "@tanstack/react-router";
import { DoorPage } from "@/components/site/DoorPage";
import { parts } from "@/site/data/parts";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/parts")({
  loader: () => ({ title: parts.seoTitle, description: parts.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "parts", description: loaderData?.description ?? "", path: "/parts" }),
  component: () => <DoorPage door={parts} route="parts" whatsappTemplate={site.whatsappTemplates.aog} />,
});
