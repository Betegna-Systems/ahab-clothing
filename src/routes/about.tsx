import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { AhabLink, Eyebrow } from "@/components/site/ui";
import founder from "@/assets/founder-portrait.jpg";
import craftStudio from "@/assets/craft-studio.jpg";

export const Route = createFileRoute("/about")({
  head: () => seo("About", "The story of AHAB — an independent house in Addis Ababa making fitted bodycon tops by hand."),
  component: About,
});

const sections = [
  ["Why AHAB exists", "Because a well-cut top can change how a woman carries herself. AHAB makes that top in Addis Ababa, one body at a time."],
  ["The fit philosophy", "Bodycon should never mean uncomfortable. Every style is drafted to stretch, hold and breathe — fitted on real bodies before it ever ships."],
  ["How we make them", "Knits are cut, seamed and finished by hand in our atelier, with fair pay for every tailor who stitches a piece."],
  ["Our vision", "To put an Addis Ababa-made top in wardrobes around the world, quietly and confidently."],
];

function About() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-20 md:px-10 lg:grid-cols-2">
        <img src={founder} alt="AHAB founder in her Addis Ababa atelier" className="aspect-4/5 w-full object-cover" />
        <div className="lg:pl-10">
          <Eyebrow>The Founder</Eyebrow>
          <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">A house built on <em className="italic text-gold">fit.</em></h1>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">AHAB began at a single sewing table in Addis Ababa with one belief: that a fitted top, cut properly, can carry a whole outfit. Today we sew that top — one style, one body, one stitch at a time.</p>
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
        <img src={craftStudio} alt="" loading="lazy" className="h-[60vh] w-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-foreground/45 text-center">
          <div><h2 className="text-5xl text-cream md:text-6xl">Made With Love.</h2><AhabLink to="/shop" variant="gold" className="mt-8">Shop the tops</AhabLink></div>
        </div>
      </section>
    </div>
  );
}
