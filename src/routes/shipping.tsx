import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { headT, useT } from "@/lib/i18n";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/shipping")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(
      t("Shipping & Delivery"),
      t("AHAB delivery times and costs across Addis Ababa, Ethiopia and worldwide."),
      { path: "/shipping", locale },
    );
  },
  component: ShippingPage,
});

function ShippingPage() {
  const t = useT();
  return (
    <InfoPage eyebrow={t("Customer care")} title={t("Shipping & delivery")}>
      <p>
        {t(
          "Every AHAB piece is packed by hand in our Addis Ababa atelier and wrapped in a cotton dust bag.",
        )}
      </p>
      <h2>{t("Addis Ababa")}</h2>
      <p>{t("Delivery in 1–2 working days. Free on orders over ETB 5,000; otherwise ETB 250.")}</p>
      <h2>{t("Elsewhere in Ethiopia")}</h2>
      <p>{t("Delivery in 3–5 working days via trusted courier. ETB 600 flat rate.")}</p>
      <h2>{t("International")}</h2>
      <p>
        {t(
          "Delivery in 7–14 working days. Rates are calculated at checkout. Duties and taxes are paid by the recipient.",
        )}
      </p>
      <h2>{t("Custom commissions")}</h2>
      <p>
        {t(
          "Made-to-measure pieces ship once your final fitting is approved. We'll confirm the timeline with you directly.",
        )}
      </p>
    </InfoPage>
  );
}
