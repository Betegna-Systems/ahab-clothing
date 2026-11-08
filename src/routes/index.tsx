import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Instagram } from "lucide-react";
import { collections, images } from "@/lib/products";
import { useAllProducts } from "@/lib/firestore-products";
import { ProductCard } from "@/components/site/ProductCard";
import { AhabLink, ahabButton, Eyebrow, SectionHeading } from "@/components/site/ui";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
const craftStudio = images.craftStudio;
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, seo } from "@/lib/seo";
import { headT, useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(t(DEFAULT_TITLE), t(DEFAULT_DESCRIPTION), {
      path: "/",
      titleTemplate: false,
      locale,
    });
  },
  component: Home,
});

const gallery = [
  images.topOneShoulder,
  images.topSquareNeck,
  images.topCutout,
  images.topMockNeck,
  images.topWrap,
  images.topCowl,
];

function Home() {
  const t = useT();
  const { products } = useAllProducts();
  const newArrivals = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[calc(100svh-7.5rem)] min-h-[560px] overflow-hidden">
        <img
          src={images.heroSuits}
          alt={t("Model wearing the chocolate Taitu double-breasted AHAB suit")}
          width={1024}
          height={1440}
          className="fade-in-slow absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <p className="label-xs reveal-up text-cream/85">{t("AHAB Suits")} &middot; 2026</p>
          <h1 className="reveal-up mt-5 max-w-3xl text-6xl leading-[0.95] text-cream sm:text-7xl md:text-[7.5rem]">
            {t("Tailored for")} <em className="italic text-gold">{t("Her.")}</em>
          </h1>
          <p className="reveal-up mt-6 max-w-md text-base text-cream/85 md:text-lg">
            {t("AHAB Suits and bodycon tops, designed and tailored in Addis Ababa.")}
          </p>
          <div className="reveal-up mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/shop"
              search={{ category: "suits" }}
              className={ahabButton({ variant: "gold", size: "lg" })}
            >
              {t("Shop AHAB Suits")}
            </Link>
            <Link
              to="/shop"
              search={{ category: "tops" }}
              className={ahabButton({ variant: "ghostLight", size: "lg" })}
            >
              {t("Shop the Tops")}
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading eyebrow={t("The Collections")} title={t("Two lines. One signature.")} />
        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {collections.map((c, i) => (
            <Link
              key={c.title}
              to="/shop"
              search={{ category: c.filter }}
              className={`group relative overflow-hidden bg-secondary ${i < 2 ? "md:col-span-3 aspect-4/5 md:aspect-5/6" : "md:col-span-2 aspect-3/4"}`}
            >
              <img
                src={c.image}
                alt={t(c.title)}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream md:p-8">
                <h3 className="text-3xl md:text-4xl">{t(c.title)}</h3>
                <p className="mt-2 max-w-xs text-sm text-cream/80">{t(c.copy)}</p>
                <span className="label-xs mt-5 inline-flex items-center gap-2 text-gold">
                  {t("Discover")}{" "}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
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
            <SectionHeading eyebrow={t("Just Arrived")} title={t("New this season.")} />
            <AhabLink to="/shop" variant="quiet" size="none" className="hidden md:inline-flex">
              {t("View all")}
            </AhabLink>
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
        <SectionHeading
          eyebrow={t("Most Loved")}
          title={t("The tops they return for.")}
          align="center"
        />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Craft */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-2 lg:py-32">
          <img
            src={craftStudio}
            alt={t("Seamstress pinning a top pattern in the AHAB atelier")}
            loading="lazy"
            className="aspect-4/3 w-full object-cover"
          />
          <div className="lg:pl-12">
            <Eyebrow>{t("The Craft Behind AHAB")}</Eyebrow>
            <h2 className="mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {t("Every stitch.")} <em className="italic text-gold">{t("One body")}</em>{" "}
              {t("at a time.")}
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-primary-foreground/75">
              {t(
                "Every top is cut, seamed and finished by hand in our Addis Ababa atelier — fitted on real bodies, not just the mannequin, so the stretch holds you exactly where it should.",
              )}
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-8">
              {[
                ["Made in Addis Ababa", "Cut and finished by hand in our own atelier."],
                ["A fit that holds", "Each style is fitted on the body before it ships."],
                ["Quality fabrics", "Stretch knits and crepes chosen for recovery and feel."],
                ["Fair work", "Fair pay for every tailor who stitches a piece."],
              ].map(([title = "", detail = ""]) => (
                <div key={title}>
                  <dt className="font-serif text-2xl text-gold">{t(title)}</dt>
                  <dd className="mt-2 text-sm text-primary-foreground/70">{t(detail)}</dd>
                </div>
              ))}
            </dl>
            <AhabLink to="/about" variant="ghostLight" className="mt-12">
              {t("Read our story")}
            </AhabLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading
          eyebrow={t("Customer feedback")}
          title={t("Reviews after delivery.")}
          align="center"
        />
        <p className="mx-auto mt-6 max-w-xl text-center text-muted-foreground">
          {t(
            "We’re preparing verified customer reviews. Feedback will be published after an order has been delivered and reviewed.",
          )}
        </p>
      </section>

      {/* Instagram */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1500px] px-5 text-center md:px-10">
          <Eyebrow>{INSTAGRAM_HANDLE}</Eyebrow>
          <h2 className="mt-5 text-4xl md:text-5xl">{t("Follow Our Journey")}</h2>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-1 md:grid-cols-6">
          {gallery.map((src, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <span className="absolute inset-0 grid place-items-center bg-foreground/0 transition-colors group-hover:bg-foreground/35">
                <Instagram
                  className="h-5 w-5 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                  strokeWidth={1.25}
                />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <img
          src={images.heroCampaign}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center text-cream md:py-44">
          <p className="label-xs text-gold">AHAB &middot; {t("Addis Ababa")}</p>
          <h2 className="mt-6 text-6xl leading-none md:text-8xl">
            {t("Worn Close.")} <em className="italic">{t("Worn Often.")}</em>
          </h2>
          <AhabLink to="/shop" variant="gold" size="lg" className="mt-12">
            {t("Start Shopping")}
          </AhabLink>
        </div>
      </section>
    </>
  );
}
