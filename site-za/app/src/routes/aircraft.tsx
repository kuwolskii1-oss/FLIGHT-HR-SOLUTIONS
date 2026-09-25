import { createFileRoute } from "@tanstack/react-router";
import { DoorPage } from "@/components/site/DoorPage";
import { aircraft } from "@/site/data/aircraft";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/aircraft")({
  loader: () => ({ title: aircraft.seoTitle, description: aircraft.metaDescription }),
  head: ({ loaderData }) => pageHead({ title: loaderData?.title ?? "aircraft", description: loaderData?.description ?? "", path: "/aircraft" }),
  component: () => <DoorPage door={aircraft} route="aircraft" />,
});
