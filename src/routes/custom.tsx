import { createFileRoute, Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/site/ui";
import { seo } from "@/lib/seo";
import { headT, useT } from "@/lib/i18n";

export const Route = createFileRoute("/custom")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(
      t("Custom Commissions"),
      t("Custom commissions are currently paused."),
      { path: "/custom", locale, index: false },
    );
  },
  component: CustomHold,
});

function CustomHold() {
  const t = useT();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-5 py-24 text-center">
      <div>
        <Eyebrow>{t("The Atelier")}</Eyebrow>
        <h1 className="mt-6 text-5xl md:text-7xl">{t("Custom orders are paused")}</h1>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          {t(
            "We are not accepting custom commissions right now. Please explore our ready-to-wear collection.",
          )}
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center justify-center bg-primary px-8 text-primary-foreground"
        >
          {t("Shop the collection")}
        </Link>
      </div>
    </div>
  );
}
