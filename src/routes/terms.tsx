import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { headT, useT } from "@/lib/i18n";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/terms")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(t("Terms of Service"), t("The terms that apply when you shop with AHAB Clothing."), {
      path: "/terms",
      locale,
    });
  },
  component: TermsPage,
});

function TermsPage() {
  const t = useT();
  return (
    <InfoPage eyebrow={t("Legal")} title={t("Terms of service")}>
      <p>{t("By placing an order with AHAB Clothing you agree to these terms.")}</p>
      <h2>{t("Pricing")}</h2>
      <p>
        {t(
          "All prices are shown in Ethiopian Birr (ETB). We reserve the right to correct pricing errors before an order ships.",
        )}
      </p>
      <h2>{t("Handmade variation")}</h2>
      <p>
        {t(
          "Our pieces are woven and finished by hand, so small variations in colour and pattern are part of their character, not a fault.",
        )}
      </p>
      <h2>{t("Custom commissions")}</h2>
      <p>{t("Commissions require a deposit and are non-refundable once cutting begins.")}</p>
      <h2>{t("Contact")}</h2>
      <p>{t("Questions about these terms? Reach us through the contact page.")}</p>
    </InfoPage>
  );
}
