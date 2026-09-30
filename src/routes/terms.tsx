import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms of Service", "The terms that apply when you shop with AHAB Clothing."),
  component: () => (
    <InfoPage eyebrow="Legal" title="Terms of service">
      <p>By placing an order with AHAB Clothing you agree to these terms.</p>
      <h2>Pricing</h2>
      <p>All prices are shown in Ethiopian Birr (ETB). We reserve the right to correct pricing errors before an order ships.</p>
      <h2>Handmade variation</h2>
      <p>Our pieces are woven and finished by hand, so small variations in colour and pattern are part of their character, not a fault.</p>
      <h2>Custom commissions</h2>
      <p>Commissions require a deposit and are non-refundable once cutting begins.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? Reach us through the contact page.</p>
    </InfoPage>
  ),
});
