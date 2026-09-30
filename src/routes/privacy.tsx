import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", "How AHAB Clothing collects, uses and protects your personal information."),
  component: () => (
    <InfoPage eyebrow="Legal" title="Privacy policy">
      <p>We collect only what we need to make, send and care for your order.</p>
      <h2>What we collect</h2>
      <p>Your name, contact details, delivery address, measurements for custom work, and order history.</p>
      <h2>How we use it</h2>
      <p>To fulfil orders, answer your questions and, only if you opt in, send occasional news about new collections.</p>
      <h2>Your bag and wishlist</h2>
      <p>These are stored on your own device and are not sent to us until you check out.</p>
      <h2>Your rights</h2>
      <p>You may ask to see, correct or delete your information at any time by contacting us.</p>
    </InfoPage>
  ),
});
