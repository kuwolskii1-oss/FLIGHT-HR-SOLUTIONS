import { createFileRoute } from "@tanstack/react-router";
import { DoorPage } from "@/components/site/DoorPage";
import { advisory } from "@/site/data/advisory";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/advisory")({
  loader: () => ({ title: advisory.seoTitle, description: advisory.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "advisory", description: loaderData?.description ?? "", path: "/advisory" }),
  component: () => <DoorPage door={advisory} route="advisory" />,
});
