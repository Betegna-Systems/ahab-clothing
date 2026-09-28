import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check, Upload } from "lucide-react";
import { images } from "@/lib/products";
import { seo } from "@/lib/seo";
import { AhabButton, AhabLink, Eyebrow } from "@/components/site/ui";

export const Route = createFileRoute("/custom")({
  head: () => seo("Custom Designs", "Commission a one-of-a-kind AHAB piece — bridal, ceremony and made-to-measure clothing from our Addis Ababa atelier."),
  component: Custom,
});

const field = "h-12 w-full border-b border-border bg-transparent text-base outline-hidden transition-colors focus:border-gold placeholder:text-muted-foreground/60";
const label = "label-xs text-muted-foreground";

function Custom() {
  const [done, setDone] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Future: send to backend / email notification service
    setDone(String(data.get("name") || "").split(" ")[0] || "there");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-gold-foreground"><Check className="h-6 w-6" strokeWidth={1.25} /></div>
        <h1 className="mt-8 text-5xl">Thank you, {done}.</h1>
        <p className="mt-6 text-muted-foreground">Your request is with our atelier. A designer will contact you within two working days to talk through fabrics, fittings and timing.</p>
        <AhabLink to="/shop" className="mt-10">Continue browsing</AhabLink>
      </div>
    );
  }

  return (
    <div>
      <section className="grid lg:grid-cols-2">
        <img src={images.collectionCustom} alt="Atelier mannequin draped in ivory silk" className="aspect-4/5 w-full object-cover lg:aspect-auto lg:h-full" />
        <div className="flex flex-col justify-center px-5 py-16 md:px-16">
          <Eyebrow>The Atelier</Eyebrow>
          <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">Made for you. <em className="italic text-gold">Only you.</em></h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">Bridal gowns, ceremony wear, matching family sets — designed from a conversation, cut to your measurements, and finished by hand over three fittings.</p>
          <ol className="mt-10 space-y-5">
            {["Share your vision below", "Consultation with a designer", "Fabric selection & sketch", "Three fittings, then delivery"].map((s, i) => (
              <li key={s} className="flex items-baseline gap-5"><span className="font-serif text-2xl text-gold">0{i + 1}</span><span>{s}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24">
        <h2 className="text-center text-4xl md:text-5xl">Begin your commission</h2>
        <form onSubmit={submit} className="mt-14 grid gap-10 sm:grid-cols-2">
          <label className="grid gap-1"><span className={label}>Full name</span><input required name="name" className={field} /></label>
          <label className="grid gap-1"><span className={label}>Phone</span><input required name="phone" type="tel" placeholder="+251" className={field} /></label>
          <label className="grid gap-1"><span className={label}>Email</span><input required name="email" type="email" className={field} /></label>
          <label className="grid gap-1"><span className={label}>Occasion</span>
            <select name="occasion" className={field}><option>Wedding</option><option>Engagement</option><option>Holiday / Meskel / Timket</option><option>Graduation</option><option>Everyday</option><option>Other</option></select>
          </label>
          <label className="grid gap-1"><span className={label}>Clothing type</span>
            <select name="type" className={field}><option>Habesha kemis</option><option>Modern dress</option><option>Men's suit / shirt</option><option>Kids' set</option><option>Family matching set</option></select>
          </label>
          <label className="grid gap-1"><span className={label}>Preferred colour</span><input name="color" placeholder="Ivory with gold tibeb" className={field} /></label>
          <label className="grid gap-1 sm:col-span-2"><span className={label}>Budget</span>
            <select name="budget" className={field}><option>ETB 5,000 – 15,000</option><option>ETB 15,000 – 30,000</option><option>ETB 30,000 – 60,000</option><option>ETB 60,000+</option></select>
          </label>
          <div className="sm:col-span-2">
            <span className={label}>Measurements (cm) — optional, we can take them at your fitting</span>
            <div className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {["Bust / Chest", "Waist", "Hips", "Height"].map((m) => <input key={m} name={m} placeholder={m} inputMode="numeric" className={field} />)}
            </div>
          </div>
          <label className="sm:col-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border px-6 py-10 text-center transition-colors hover:border-gold">
            <Upload className="h-5 w-5 text-gold" strokeWidth={1.25} />
            <span className="label-xs">Upload inspiration images</span>
            <span className="text-xs text-muted-foreground">{files.length ? files.map((f) => f.name).join(", ") : "JPG or PNG, up to 5 images"}</span>
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))} />
          </label>
          <label className="grid gap-1 sm:col-span-2"><span className={label}>Additional notes</span><textarea name="notes" rows={4} className="w-full border-b border-border bg-transparent py-2 outline-hidden focus:border-gold" /></label>
          <AhabButton type="submit" size="lg" className="sm:col-span-2">Send my request</AhabButton>
        </form>
      </section>
    </div>
  );
}
