import { Link, createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { SizeChart } from "@/components/site/SizeChart";

export const Route = createFileRoute("/size-guide")({
  head: () =>
    seo(
      "Size Guide",
      "Find your AHAB size — bust, waist and hip measurements for our women's suits and tops.",
      {
        path: "/size-guide",
      },
    ),
  component: () => (
    <InfoPage eyebrow="Customer care" title="Size guide">
      <p>
        Body measurements for AHAB suits and tops. Between sizes? Choose the larger, or contact us
        for a tailored fit.
      </p>
      {/* SizeChart is the single measurement source, shared with product pages. */}
      <SizeChart />
      <h2>Suit fit</h2>
      <p>
        Blazers and trousers are sized together. If your bust and hip fall in different sizes,
        choose the larger and we can advise on alterations, or{" "}
        <Link to="/custom" className="text-foreground underline">
          request a made-to-measure suit
        </Link>
        .
      </p>
    </InfoPage>
  ),
});
