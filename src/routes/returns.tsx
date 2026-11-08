import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { headT, useT } from "@/lib/i18n";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/returns")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(
      t("Returns & Exchanges"),
      t("How to return or exchange an AHAB piece within 14 days."),
      { path: "/returns", locale },
    );
  },
  component: ReturnsPage,
});

function ReturnsPage() {
  const t = useT();
  return (
    <InfoPage eyebrow={t("Customer care")} title={t("Returns & exchanges")}>
      <p>{t("If something isn't quite right, we'll make it right.")}</p>
      <h2>{t("14-day returns")}</h2>
      <p>
        {t(
          "Ready-to-wear pieces can be returned within 14 days of delivery, unworn, with tags attached and in the original dust bag.",
        )}
      </p>
      <h2>{t("Exchanges")}</h2>
      <p>
        {t(
          "We're happy to exchange for a different size or colour, subject to availability. Exchanges within Addis Ababa are collected free of charge.",
        )}
      </p>
      <h2>{t("Final sale")}</h2>
      <p>{t("Custom commissions, altered pieces and sale items cannot be returned.")}</p>
      <h2>{t("How to start")}</h2>
      <p>
        {t(
          "Contact us with your order number and we'll arrange collection or drop-off at the atelier.",
        )}
      </p>
    </InfoPage>
  );
}
