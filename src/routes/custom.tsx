import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { images } from "@/lib/products";
import { seo } from "@/lib/seo";
import { AhabButton, Eyebrow } from "@/components/site/ui";
import { supportEmailLink } from "@/lib/contact";
import { toast } from "sonner";

export const Route = createFileRoute("/custom")({
  head: () =>
    seo("Custom Tops", "Commission a made-to-measure AHAB bodycon top — your neckline, your colour, sewn in Addis Ababa.", {
      path: "/custom",
    }),
  component: Custom,
});

const field = "h-12 w-full border-b border-border bg-transparent text-base outline-hidden transition-colors focus:border-gold placeholder:text-muted-foreground/60";
const label = "label-xs text-muted-foreground";

function Custom() {
  const [files, setFiles] = useState<File[]>([]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = Array.from(data.entries())
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => `${key}: ${String(value).trim()}`)
      .join("\n");
    const attachmentNote = files.length
      ? `\n\nPlease attach these inspiration images before sending:\n${files.map((file) => `- ${file.name}`).join("\n")}`
      : "";
    window.location.href = supportEmailLink(
      "AHAB custom top commission",
      `${body}${attachmentNote}`,
    );
    toast.info("Your email draft is ready. Send it from your mail app to submit your request.");
  };

  return (
    <div>
      <section className="grid lg:grid-cols-2">
        <img src={images.craftStudio} alt="Seamstress fitting a top on a dress form in the AHAB atelier" className="aspect-4/5 w-full object-cover lg:aspect-auto lg:h-full" />
        <div className="flex flex-col justify-center px-5 py-16 md:px-16">
          <Eyebrow>The Atelier</Eyebrow>
          <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">Your top. <em className="italic text-gold">Your lines.</em></h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">Made-to-measure bodycon tops — your neckline, your colour, your measurements. Designed from a conversation and sewn in our Addis Ababa atelier.</p>
          <ol className="mt-10 space-y-5">
            {["Share your vision below", "Consultation with a designer", "Fabric & colour selection", "One fitting, then delivery"].map((s, i) => (
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
            <select name="occasion" className={field}><option>Everyday</option><option>Wedding</option><option>Engagement</option><option>Holiday / Meskel / Timket</option><option>Graduation</option><option>Other</option></select>
          </label>
          <label className="grid gap-1"><span className={label}>Top style</span>
            <select name="type" className={field}><option>One-shoulder top</option><option>Square neck top</option><option>Cowl neck top</option><option>Corset-style top</option><option>Cutout top</option><option>Full custom design</option></select>
          </label>
          <label className="grid gap-1"><span className={label}>Preferred colour</span><input name="color" placeholder="Deep burgundy in stretch ponte" className={field} /></label>
          <label className="grid gap-1 sm:col-span-2"><span className={label}>Budget</span>
            <select name="budget" className={field}><option>ETB 2,000 – 5,000</option><option>ETB 5,000 – 10,000</option><option>ETB 10,000 – 20,000</option><option>ETB 20,000+</option></select>
          </label>
          <div className="sm:col-span-2">
            <span className={label}>Measurements (cm) — optional, we can take them at your fitting</span>
            <div className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {["Bust", "Waist", "Hips", "Height"].map((m) => <input key={m} name={m} placeholder={m} inputMode="numeric" className={field} />)}
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
