import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/returns")({
  head: () => seo("Returns & Exchanges", "How to return or exchange an AHAB piece within 14 days."),
  component: () => (
    <InfoPage eyebrow="Customer care" title="Returns & exchanges">
      <p>If something isn't quite right, we'll make it right.</p>
      <h2>14-day returns</h2>
      <p>Ready-to-wear pieces can be returned within 14 days of delivery, unworn, with tags attached and in the original dust bag.</p>
      <h2>Exchanges</h2>
      <p>We're happy to exchange for a different size or colour, subject to availability. Exchanges within Addis Ababa are collected free of charge.</p>
      <h2>Final sale</h2>
      <p>Custom commissions, altered pieces and sale items cannot be returned.</p>
      <h2>How to start</h2>
      <p>Contact us with your order number and we'll arrange collection or drop-off at the atelier.</p>
    </InfoPage>
  ),
});
