import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { toast } from "sonner";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All pieces", to: "/shop" },
      { label: "Lookbook", to: "/lookbook" },
      { label: "Custom designs", to: "/custom" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Contact us", to: "/contact" },
      { label: "Size guide", to: "/size-guide" },
      { label: "Shipping & delivery", to: "/shipping" },
      { label: "Returns", to: "/returns" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "About AHAB", to: "/about" },
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
    ],
  },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <span className="font-serif text-4xl tracking-[0.3em]">AHAB</span>
            <p className="label-xs mt-2 text-gold">Made With Love</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              An independent Ethiopian house designing traditional and modern clothing in Addis
              Ababa. Woven, cut and finished by hand.
            </p>

            <form
              className="mt-10 max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) {
                  toast.error("Please enter a valid email address");
                  return;
                }
                toast.success("Welcome to AHAB", {
                  description: "Look out for first access to new collections.",
                });
                setEmail("");
              }}
            >
              <label className="label-xs text-primary-foreground/60" htmlFor="newsletter">
                New collections, first
              </label>
              <div className="mt-3 flex border-b border-primary-foreground/30">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-11 flex-1 bg-transparent text-sm outline-hidden placeholder:text-primary-foreground/40"
                />
                <button type="submit" className="label-xs px-2 text-gold">
                  Join
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="label-xs text-gold">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-primary-foreground/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-xs text-primary-foreground/50">
            © {new Date().getFullYear()} AHAB Clothing · Addis Ababa, Ethiopia
          </p>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-gold">
              <Instagram className="h-4 w-4" strokeWidth={1.25} />
            </a>
            <a href="https://tiktok.com" aria-label="TikTok" className="hover:text-gold">
              <Music2 className="h-4 w-4" strokeWidth={1.25} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-gold">
              <Facebook className="h-4 w-4" strokeWidth={1.25} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
