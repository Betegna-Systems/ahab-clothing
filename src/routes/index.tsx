import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Instagram } from "lucide-react";
import { collections, images, products, testimonials } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { AhabLink, Eyebrow, SectionHeading } from "@/components/site/ui";
import craftLoom from "@/assets/craft-loom.jpg";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import founder from "@/assets/founder-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AHAB Clothing — Wear Your Story | Ethiopian Luxury Fashion" },
      {
        name: "description",
        content:
          "Contemporary Ethiopian fashion crafted with love in Addis Ababa. Traditional, modern and custom pieces for women, men and kids.",
      },
      { property: "og:title", content: "AHAB Clothing — Wear Your Story" },
      { property: "og:description", content: "Contemporary Ethiopian fashion crafted with love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const newArrivals = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
const gallery = [lookbook1, images.collectionWomen, lookbook2, images.collectionKids, images.productShawl, images.collectionMen];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[calc(100svh-7.5rem)] min-h-[560px] overflow-hidden">
        <img
          src={images.heroCampaign}
          alt="Model in an ivory AHAB gown with gold tibeb border"
          width={1600}
          height={1920}
          className="fade-in-slow absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <p className="label-xs reveal-up text-cream/85">Autumn Collection · 2026</p>
          <h1 className="reveal-up mt-5 max-w-3xl text-6xl leading-[0.95] text-cream sm:text-7xl md:text-[7.5rem]">
            Wear Your <em className="italic text-gold">Story.</em>
          </h1>
          <p className="reveal-up mt-6 max-w-md text-base text-cream/85 md:text-lg">
            Contemporary Ethiopian fashion crafted with love.
          </p>
          <div className="reveal-up mt-10 flex flex-col gap-3 sm:flex-row">
            <AhabLink to="/shop" variant="gold" size="lg">Shop Collection</AhabLink>
            <AhabLink to="/custom" variant="ghostLight" size="lg">Explore Custom Designs</AhabLink>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading eyebrow="The Collections" title="Five ways to wear AHAB." />
        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {collections.map((c, i) => (
            <Link
              key={c.title}
              to={c.filter === "custom" ? "/custom" : "/shop"}
              search={(c.filter === "custom" ? {} : { category: c.filter }) as never}
              className={`group relative overflow-hidden bg-secondary ${i < 2 ? "md:col-span-3 aspect-4/5 md:aspect-5/6" : "md:col-span-2 aspect-3/4"}`}
            >
              <img src={c.image} alt={c.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream md:p-8">
                <h3 className="text-3xl md:text-4xl">{c.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-cream/80">{c.copy}</p>
                <span className="label-xs mt-5 inline-flex items-center gap-2 text-gold">
                  Discover <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals carousel */}
      <section className="bg-secondary py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Just Arrived" title="New this season." />
            <AhabLink to="/shop" variant="quiet" size="none" className="hidden md:inline-flex">View all</AhabLink>
          </div>
        </div>
        <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:none]">
          {newArrivals.map((p) => (
            <div key={p.slug} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading eyebrow="Most Loved" title="The pieces they return for." align="center" />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {bestSellers.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Craft */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-2 lg:py-32">
          <img src={craftLoom} alt="Hands weaving gold tibeb on a wooden loom" loading="lazy" className="aspect-4/3 w-full object-cover" />
          <div className="lg:pl-12">
            <Eyebrow>The Craft Behind AHAB</Eyebrow>
            <h2 className="mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Sixty hours. <em className="italic text-gold">One thread</em> at a time.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-primary-foreground/75">
              Every tibeb border is woven by hand on wooden looms by artisans in and around Addis Ababa — a craft passed between generations, now carried into silhouettes made for today.
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-8">
              {[
                ["Handmade", "Woven, cut and finished by hand in our atelier."],
                ["Ethiopian inspiration", "Patterns drawn from Lalibela, Aksum and Harar."],
                ["Quality fabrics", "Hand-spun cotton, washed linen and pure silk."],
                ["Local craftsmanship", "Fair pay for every weaver and tailor we work with."],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-serif text-2xl text-gold">{t}</dt>
                  <dd className="mt-2 text-sm text-primary-foreground/70">{d}</dd>
                </div>
              ))}
            </dl>
            <AhabLink to="/about" variant="ghostLight" className="mt-12">Read our story</AhabLink>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading eyebrow="In Their Words" title="Worn, and remembered." align="center" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={t.name} className="bg-card p-8 shadow-soft transition-transform duration-500 hover:-translate-y-1 md:p-10">
              <img src={[founder, images.collectionMen, lookbook1][i]} alt={t.name} loading="lazy" className="h-14 w-14 rounded-full object-cover object-top" />
              <blockquote className="mt-6 font-serif text-xl leading-snug">“{t.quote}”</blockquote>
              <figcaption className="label-xs mt-6 text-muted-foreground">{t.name} · {t.city}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1500px] px-5 text-center md:px-10">
          <Eyebrow>@ahabclothing</Eyebrow>
          <h2 className="mt-5 text-4xl md:text-5xl">Follow Our Journey</h2>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-1 md:grid-cols-6">
          {gallery.map((src, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-foreground/0 transition-colors group-hover:bg-foreground/35">
                <Instagram className="h-5 w-5 text-cream opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.25} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <img src={lookbook2} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center text-cream md:py-44">
          <p className="label-xs text-gold">AHAB · Addis Ababa</p>
          <h2 className="mt-6 text-6xl leading-none md:text-8xl">Designed With <em className="italic">Love.</em></h2>
          <AhabLink to="/shop" variant="gold" size="lg" className="mt-12">Start Shopping</AhabLink>
        </div>
      </section>
    </>
  );
}
