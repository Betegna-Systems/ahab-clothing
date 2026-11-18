import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { headT, useT } from "@/lib/i18n";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(
      t("Privacy Policy"),
      t("How AHAB Clothing collects, uses and protects your personal information."),
      { path: "/privacy", locale },
    );
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const t = useT();
  return (
    <InfoPage eyebrow={t("Legal")} title={t("Privacy policy")}>
      <p>{t("We collect only what we need to make, send and care for your order.")}</p>
      <h2>{t("What we collect")}</h2>
      <p>
        {t(
          "Your name, contact details, delivery address, and order history.",
        )}
      </p>
      <h2>{t("How we use it")}</h2>
      <p>
        {t(
          "To fulfil orders, answer your questions, and maintain your account. We send occasional news about new collections only if you opt in.",
        )}
      </p>
      <h2>{t("Your bag and wishlist")}</h2>
      <p>{t("These are stored on your own device and are not sent to us until you check out.")}</p>
      <h2>{t("Your rights")}</h2>
      <p>
        {t("You may ask to see, correct or delete your information at any time by contacting us.")}
      </p>
    </InfoPage>
  );
}
