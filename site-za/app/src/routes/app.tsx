import { createFileRoute, redirect } from "@tanstack/react-router";

interface AppSearch {
  preview: boolean;
}

// The scaffold's /app workspace is not part of this website: the route is kept for the
// template contract (previewMode search parameter) but always redirects to the home page.
export const Route = createFileRoute("/app")({
  validateSearch: (search: Record<string, unknown>): AppSearch => ({
    preview: search.preview === "1" || search.preview === true,
  }),
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
  component: () => null,
});
