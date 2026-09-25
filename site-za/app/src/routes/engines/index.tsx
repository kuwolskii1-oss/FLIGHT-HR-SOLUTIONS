import { createFileRoute } from "@tanstack/react-router";
import { DoorPage } from "@/components/site/DoorPage";
import { engines } from "@/site/data/engines";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/engines/")({
  loader: () => ({ title: engines.seoTitle, description: engines.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "engines", description: loaderData?.description ?? "", path: "/engines" }),
  component: () => <DoorPage door={engines} route="engines" />,
});
