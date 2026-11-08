import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { localizePath, splitLocale } from "./lib/i18n/locale";
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
    // /am/… URLs are the same routes in Amharic: strip the prefix on the way in and add it
    // back to every link and navigation on the way out.
    rewrite: {
      input: ({ url }) => {
        const { locale, pathname } = splitLocale(url.pathname);
        i18n.locale = locale;
        if (locale === "en") return undefined;
        url.pathname = pathname;
        return url;
      },
      output: ({ url }) => {
        if (i18n.locale === "en") return undefined;
        url.pathname = localizePath(url.pathname, i18n.locale);
        return url;
      },
    },
  });

  return router;
};
