import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/shipping")({
  head: () => seo("Shipping & Delivery", "AHAB delivery times and costs across Addis Ababa, Ethiopia and worldwide."),
  component: () => (
    <InfoPage eyebrow="Customer care" title="Shipping & delivery">
      <p>Every AHAB piece is packed by hand in our Addis Ababa atelier and wrapped in a cotton dust bag.</p>
      <h2>Addis Ababa</h2>
      <p>Delivery in 1–2 working days. Free on orders over ETB 5,000; otherwise ETB 250.</p>
      <h2>Elsewhere in Ethiopia</h2>
      <p>Delivery in 3–5 working days via trusted courier. ETB 600 flat rate.</p>
      <h2>International</h2>
      <p>Delivery in 7–14 working days. Rates are calculated at checkout. Duties and taxes are paid by the recipient.</p>
      <h2>Custom commissions</h2>
      <p>Made-to-measure pieces ship once your final fitting is approved. We'll confirm the timeline with you directly.</p>
    </InfoPage>
  ),
});
