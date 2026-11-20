import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SITE_URL, seo } from "@/lib/seo";
import { AhabButton } from "@/components/site/ui";
import { SUPPORT_EMAIL } from "@/lib/contact";
import { submitContactMessage } from "@/lib/contact-messages.functions";
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
  const [sending, setSending] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    setSending(true);
    try {
      const result = await submitContactMessage({
        data: {
          name: value("name"),
          email: value("email"),
          phone: value("phone"),
          message: value("message"),
          website: value("website"),
        },
      });
      if (result.ok) {
        formElement.reset();
        toast.success(t("Thank you — your message has been sent. We'll get back to you soon."));
      } else if (result.reason === "rate_limited") {
        toast.error(
          t("You've sent several messages recently. Please wait a while or reach us on WhatsApp."),
        );
      } else {
        toast.error(t("We couldn't send your message. Please try again or reach us on WhatsApp."));
      }
    } catch {
      toast.error(t("We couldn't send your message. Please try again or reach us on WhatsApp."));
    } finally {
      setSending(false);
    }
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
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px opacity-0"
          />
          <AhabButton type="submit" size="lg" disabled={sending}>
            {sending ? t("Sending…") : t("Send message")}
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
