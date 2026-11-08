import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { SITE_URL, seo } from "@/lib/seo";
import { AhabButton } from "@/components/site/ui";
import { SUPPORT_EMAIL, supportEmailLink } from "@/lib/contact";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/social";
import { headT, useT } from "@/lib/i18n";

const CONTACT_DESCRIPTION =
  "Reach AHAB Clothing in Addis Ababa by phone, email, WhatsApp or social media.";

export const Route = createFileRoute("/contact")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(t("Contact"), t(CONTACT_DESCRIPTION), {
      path: "/contact",
      locale,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact AHAB Clothing",
        url: `${SITE_URL}/contact`,
        description: CONTACT_DESCRIPTION,
      },
    });
  },
  component: Contact,
});

const field = "h-12 w-full border-b border-border bg-transparent outline-hidden focus:border-gold";

function Contact() {
  const t = useT();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // The email goes to AHAB staff, so its labels stay in English.
    const body = [
      `Name: ${String(form.get("name") ?? "").trim()}`,
      `Email: ${String(form.get("email") ?? "").trim()}`,
      `Phone: ${String(form.get("phone") ?? "").trim() || "Not provided"}`,
      "",
      String(form.get("message") ?? "").trim(),
    ].join("\n");
    window.location.href = supportEmailLink("AHAB website enquiry", body);
    toast.info(
      t("Your email draft is ready. Send it from your mail app to complete your message."),
    );
  };
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10">
      <p className="label-xs text-gold">{t("Contact")}</p>
      <h1 className="mt-5 text-5xl md:text-7xl">{t("We'd love to hear from you.")}</h1>
      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <form onSubmit={submit} className="grid gap-8">
          <input required name="name" placeholder={t("Name")} className={field} />
          <input required name="email" type="email" placeholder={t("Email")} className={field} />
          <input name="phone" type="tel" placeholder={t("Phone")} className={field} />
          <textarea
            required
            name="message"
            rows={5}
            placeholder={t("Your message")}
            className="border-b border-border bg-transparent py-2 outline-hidden focus:border-gold"
          />
          <AhabButton type="submit" size="lg">
            {t("Send message")}
          </AhabButton>
        </form>
        <div className="space-y-8">
          <dl className="grid grid-cols-2 gap-8 text-sm">
            {[
              [t("Phone"), "+251 925 105 950", "tel:+251925105950"],
              [t("Email"), SUPPORT_EMAIL, `mailto:${SUPPORT_EMAIL}`],
              ["WhatsApp", t("Chat with us"), "https://wa.me/251925105950"],
              ["Instagram", INSTAGRAM_HANDLE, INSTAGRAM_URL],
              ["TikTok", TIKTOK_HANDLE, TIKTOK_URL],
            ].map(([k, v, href]) => (
              <div key={k}>
                <dt className="label-xs text-muted-foreground">{k}</dt>
                <dd className="mt-2">
                  <a href={href} className="link-underline">
                    {v}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          <p className="label-xs">{t("Addis Ababa, Ethiopia")}</p>
          <iframe
            title={t("AHAB location")}
            loading="lazy"
            className="aspect-4/3 w-full border-0 grayscale"
            src="https://www.google.com/maps?q=Addis+Ababa&output=embed"
          />
        </div>
      </div>
    </div>
  );
}
