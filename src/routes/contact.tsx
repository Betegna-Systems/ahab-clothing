import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { AhabButton } from "@/components/site/ui";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Reach AHAB Clothing in Addis Ababa by phone, email, WhatsApp or social media."),
  component: Contact,
});

const field = "h-12 w-full border-b border-border bg-transparent outline-hidden focus:border-gold";

function Contact() {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent", { description: "We'll reply within one working day." });
    e.currentTarget.reset();
  };
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10">
      <p className="label-xs text-gold">Contact</p>
      <h1 className="mt-5 text-5xl md:text-7xl">We'd love to hear from you.</h1>
      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <form onSubmit={submit} className="grid gap-8">
          <input required placeholder="Name" className={field} />
          <input required type="email" placeholder="Email" className={field} />
          <input type="tel" placeholder="Phone" className={field} />
          <textarea required rows={5} placeholder="Your message" className="border-b border-border bg-transparent py-2 outline-hidden focus:border-gold" />
          <AhabButton type="submit" size="lg">Send message</AhabButton>
        </form>
        <div className="space-y-8">
          <dl className="grid grid-cols-2 gap-8 text-sm">
            {[
              ["Phone", "+251 911 000 000", "tel:+251911000000"],
              ["Email", "hello@ahabclothing.com", "mailto:hello@ahabclothing.com"],
              ["WhatsApp", "Chat with us", "https://wa.me/251911000000"],
              ["Instagram", "@ahabclothing", "https://instagram.com"],
              ["TikTok", "@ahabclothing", "https://tiktok.com"],
              ["Facebook", "AHAB Clothing", "https://facebook.com"],
            ].map(([k, v, href]) => (
              <div key={k}><dt className="label-xs text-muted-foreground">{k}</dt><dd className="mt-2"><a href={href} className="link-underline">{v}</a></dd></div>
            ))}
          </dl>
          <p className="label-xs">Addis Ababa, Ethiopia</p>
          <iframe title="AHAB location" loading="lazy" className="aspect-4/3 w-full border-0 grayscale" src="https://www.google.com/maps?q=Addis+Ababa&output=embed" />
        </div>
      </div>
    </div>
  );
}
