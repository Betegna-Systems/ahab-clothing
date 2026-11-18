import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { I18nContext } from "./lib/i18n";

export const getRouter = () => {
  const queryClient = new QueryClient();
  // One router per request on the server (and one in the browser), so this is per visitor.
  const i18n: I18nContext = { locale: "en" };

  const router = createRouter({
    routeTree,
    context: { queryClient, i18n },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Pages cross-fade, and a clicked product photo grows into the product page
    // (see lib/view-transition.ts). Ignored by browsers without the View Transitions API.
    defaultViewTransition: true,
  });

  return router;
};
