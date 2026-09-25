import { createFileRoute } from "@tanstack/react-router";
import { DoorPage } from "@/components/site/DoorPage";
import { charter } from "@/site/data/charter";
import { site } from "@/site/data/site";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/charter")({
  loader: () => ({ title: charter.seoTitle, description: charter.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "charter", description: loaderData?.description ?? "", path: "/charter" }),
  component: () => <DoorPage door={charter} route="charter" whatsappTemplate={site.whatsappTemplates.charter} />,
});
