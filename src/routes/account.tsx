import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { AhabLink } from "@/components/site/ui";

export const Route = createFileRoute("/account")({
  head: () => seo("Account", "Sign in to view your AHAB orders, wishlist and saved addresses."),
  component: () => (
    <InfoPage eyebrow="Your account" title="Accounts are coming soon.">
      <p>Soon you'll be able to sign in to see your orders, keep your wishlist across devices and save delivery addresses. Until then, your bag and wishlist are saved on this device.</p>
      <AhabLink to="/wishlist">View wishlist</AhabLink>
    </InfoPage>
  ),
});
