import { createFileRoute } from "@tanstack/react-router";
import { images } from "@/lib/products";
import { seo } from "@/lib/seo";
import { AhabLink } from "@/components/site/ui";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import craft from "@/assets/craft-loom.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => seo("Lookbook — Autumn 2026", "An editorial journey through AHAB's Autumn 2026 collection, photographed in Addis Ababa."),
  component: Lookbook,
});

function Lookbook() {
  return (
    <div>
      <header className="mx-auto max-w-[1500px] px-5 py-20 text-center md:px-10 md:py-28">
        <p className="label-xs text-gold">Volume IV · Autumn 2026</p>
        <h1 className="mt-6 text-6xl leading-none md:text-[8rem]">Light on <em className="italic">stone.</em></h1>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground">Photographed across Addis Ababa at golden hour.</p>
      </header>

      <div className="mx-auto max-w-[1500px] space-y-4 px-5 pb-24 md:space-y-6 md:px-10">
        <img src={lookbook1} alt="Ivory cape gown in an arched doorway" className="w-full object-cover md:aspect-16/9" loading="eager" />
        <div className="grid gap-4 md:grid-cols-[2fr_3fr] md:gap-6">
          <div className="flex flex-col justify-end py-10 md:py-0 md:pr-10">
            <p className="label-xs text-gold">01 — The Arch</p>
            <p className="mt-4 font-serif text-3xl leading-snug md:text-4xl">“Stillness is the most elegant thing a garment can hold.”</p>
          </div>
          <img src={images.heroCampaign} alt="" loading="lazy" className="aspect-4/5 w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          <img src={images.collectionWomen} alt="" loading="lazy" className="aspect-3/4 w-full object-cover" />
          <img src={images.collectionTraditional} alt="" loading="lazy" className="aspect-3/4 w-full object-cover md:mt-24" />
          <img src={images.collectionMen} alt="" loading="lazy" className="col-span-2 aspect-3/4 w-full object-cover md:col-span-1" />
        </div>
        <img src={lookbook2} alt="Two models on stone steps in cream and chocolate linen" loading="lazy" className="w-full object-cover md:aspect-16/9" />
        <div className="grid gap-4 md:grid-cols-[3fr_2fr] md:gap-6">
          <img src={craft} alt="" loading="lazy" className="aspect-4/3 w-full object-cover" />
          <div className="flex flex-col justify-center py-10 md:pl-10">
            <p className="label-xs text-gold">02 — The Loom</p>
            <p className="mt-4 font-serif text-3xl leading-snug md:text-4xl">Every border begins as a single gold thread.</p>
            <AhabLink to="/shop" className="mt-10 self-start">Shop the looks</AhabLink>
          </div>
        </div>
      </div>
    </div>
  );
}
