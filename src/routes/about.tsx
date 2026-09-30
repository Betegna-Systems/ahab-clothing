import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { AhabLink, Eyebrow } from "@/components/site/ui";
import founder from "@/assets/founder-portrait.jpg";
import craft from "@/assets/craft-loom.jpg";

export const Route = createFileRoute("/about")({
  head: () => seo("About", "The story of AHAB — an independent Ethiopian fashion house in Addis Ababa, made with love."),
  component: About,
});

const sections = [
  ["Why AHAB exists", "Because the clothes our grandmothers wore deserve a future. AHAB bridges heritage and the way we live now."],
  ["Ethiopian inspiration", "Tibeb patterns, the light of Entoto, the stonework of Lalibela — every collection begins at home."],
  ["The handmade process", "Cotton is spun, woven, cut and finished by hand, with fair pay for every artisan we work with."],
  ["Our vision", "To make Ethiopian design a quiet, confident presence in wardrobes around the world."],
];

function About() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-20 md:px-10 lg:grid-cols-2">
        <img src={founder} alt="AHAB founder in her Addis Ababa atelier" className="aspect-4/5 w-full object-cover" />
        <div className="lg:pl-10">
          <Eyebrow>The Founder</Eyebrow>
          <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">A house built on <em className="italic text-gold">love.</em></h1>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">AHAB began at a single sewing table in Addis Ababa, with one belief: that clothing can carry a culture forward without losing its soul. Today our atelier dresses brides, families and everyday dreamers — still one piece at a time.</p>
        </div>
      </section>
      <section className="bg-secondary py-24">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:grid-cols-2 md:px-10">
          {sections.map(([t, d]) => (
            <div key={t} className="border-t border-border pt-6"><h2 className="text-3xl">{t}</h2><p className="mt-4 text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="relative">
        <img src={craft} alt="" loading="lazy" className="h-[60vh] w-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-foreground/45 text-center">
          <div><h2 className="text-5xl text-cream md:text-6xl">Made With Love.</h2><AhabLink to="/shop" variant="gold" className="mt-8">Shop the collection</AhabLink></div>
        </div>
      </section>
    </div>
  );
}
