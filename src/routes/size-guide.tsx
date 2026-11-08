import { Link, createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { SizeChart } from "@/components/site/SizeChart";
import { headT, useT } from "@/lib/i18n";

export const Route = createFileRoute("/size-guide")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(
      t("Size Guide"),
      t("Find your AHAB size — bust, waist and hip measurements for our women's suits and tops."),
      {
        path: "/size-guide",
        locale,
      },
    );
  },
  component: SizeGuide,
});

function SizeGuide() {
  const t = useT();
  return (
    <InfoPage eyebrow={t("Customer care")} title={t("Size guide")}>
      <p>
        {t(
          "Body measurements for AHAB suits and tops. Between sizes? Choose the larger, or contact us for a tailored fit.",
        )}
      </p>
      {/* SizeChart is the single measurement source, shared with product pages. */}
      <SizeChart />
      <h2>{t("Suit fit")}</h2>
      <p>
        {t(
          "Blazers and trousers are sized together. If your bust and hip fall in different sizes, choose the larger and we can advise on alterations, or",
        )}{" "}
        <Link to="/custom" className="text-foreground underline">
          {t("request a made-to-measure suit")}
        </Link>
        {t(".")}
      </p>
    </InfoPage>
  );
}
