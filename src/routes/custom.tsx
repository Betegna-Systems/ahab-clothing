import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AhabButton, Eyebrow } from "@/components/site/ui";
import { submitCustomCommission } from "@/lib/custom-commissions.functions";
import { images } from "@/lib/products";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/custom")({
  head: () =>
    seo(
      "Custom Commissions",
      "Commission a made-to-measure AHAB suit or bodycon top, designed with you and sewn in our Addis Ababa atelier.",
      { path: "/custom" },
    ),
  component: Custom,
});

const field =
  "h-12 w-full border-b border-border bg-transparent text-base outline-hidden transition-colors focus:border-gold placeholder:text-muted-foreground/60";
const label = "label-xs text-muted-foreground";
const topMeasurements = ["Bust", "Waist", "Hips", "Height"];
const suitMeasurements = [
  "Bust",
  "Waist",
  "Hips",
  "Shoulder width",
  "Sleeve length",
  "Jacket length",
  "Trouser waist",
  "Trouser inseam",
  "Height",
];

async function fileToBase64(file: File) {
  if (file.size > 20 * 1024 * 1024) {
    throw new Error("An inspiration photo is too large. Choose a file under 20 MB.");
  }
  const bitmap = await createImageBitmap(file);
  if (bitmap.width * bitmap.height > 40_000_000) {
    bitmap.close();
    throw new Error("Choose a smaller-resolution inspiration photo.");
  }

  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Your browser couldn't prepare the inspiration photo.");
  }
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let blob: Blob | null = null;
  for (const quality of [0.82, 0.72, 0.62, 0.52]) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (blob && blob.size <= 512 * 1024) break;
  }
  if (!blob || blob.size > 512 * 1024) {
    throw new Error("An inspiration photo is too large to upload. Choose a smaller image.");
  }

  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32_768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32_768));
  }
  return { mimeType: "image/jpeg" as const, imageBase64: btoa(binary) };
}

function Custom() {
  const [files, setFiles] = useState<File[]>([]);
  const [commissionType, setCommissionType] = useState<"top" | "suit">("top");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setNotice("");
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const measurements = Object.fromEntries(
      Array.from(data.entries())
        .filter(
          ([key, value]) =>
            key.startsWith("measurement_") && typeof value === "string" && value.trim(),
        )
        .map(([key, value]) => [key.slice("measurement_".length), String(value).trim()]),
    );

    try {
      const images = await Promise.all(files.map(fileToBase64));
      const result = await submitCustomCommission({
        data: {
          commissionType,
          customerName: String(data.get("name") ?? "").trim(),
          phone: String(data.get("phone") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          occasion: String(data.get("occasion") ?? ""),
          style: String(data.get("type") ?? ""),
          color: String(data.get("color") ?? "").trim(),
          fabric: String(data.get("fabric") ?? "").trim(),
          budget: String(data.get("budget") ?? ""),
          measurements,
          fitPreferences: String(data.get("fit_preferences") ?? ""),
          notes: String(data.get("notes") ?? "").trim(),
          privacyConsent: data.get("privacyConsent") === "on",
          images,
        },
      });

      if (!result.ok) {
        const messages = {
          rate_limited: "Too many requests were sent from this email. Please try again later.",
          invalid_measurements: "Check that measurements contain numbers in centimeters.",
          invalid_image: "An inspiration image could not be verified. Please choose another image.",
          upload_failed: "We couldn't upload the inspiration images. Please try again.",
          save_failed: "We couldn't save your request. Please try again.",
        };
        setNotice(messages[result.reason]);
        toast.error(messages[result.reason]);
        return;
      }

      formElement.reset();
      setFiles([]);
      setNotice(`Request saved. Your reference is ${result.id.slice(0, 8).toUpperCase()}.`);
      toast.success("Your custom request has been sent to AHAB.");
    } catch (error) {
      console.error("Custom commission submission failed.");
      const message =
        error instanceof Error &&
        (error.message.includes("inspiration photo") ||
          error.message.includes("smaller-resolution"))
          ? error.message
          : "We couldn't submit your request. Please check your connection and try again.";
      setNotice(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const measurements = commissionType === "suit" ? suitMeasurements : topMeasurements;

  return (
    <div>
      <section className="grid lg:grid-cols-2">
        <img
          src={images.craftStudio}
          alt="Seamstress fitting a garment on a dress form in the AHAB atelier"
          className="aspect-4/5 w-full object-cover lg:aspect-auto lg:h-full"
        />
        <div className="flex flex-col justify-center px-5 py-16 md:px-16">
          <Eyebrow>The Atelier</Eyebrow>
          <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">
            Made for <em className="italic text-gold">your lines.</em>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Commission a made-to-measure suit or bodycon top — designed around your style, colour
            and fit, then sewn in our Addis Ababa atelier.
          </p>
          <ol className="mt-10 space-y-5">
            {[
              "Share your vision below",
              "Consultation with a designer",
              "Fabric, colour & fit selection",
              "Fitting, alterations & delivery",
            ].map((step, index) => (
              <li key={step} className="flex items-baseline gap-5">
                <span className="font-serif text-2xl text-gold">0{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24">
        <h2 className="text-center text-4xl md:text-5xl">Begin your commission</h2>
        {notice ? (
          <p role="status" className="mt-6 border border-border p-4 text-sm">
            {notice}
          </p>
        ) : null}
        <form onSubmit={submit} className="mt-14 grid gap-10 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className={label}>Full name</span>
            <input required name="name" autoComplete="name" className={field} />
          </label>
          <label className="grid gap-1">
            <span className={label}>Phone</span>
            <input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+251"
              className={field}
            />
          </label>
          <label className="grid gap-1">
            <span className={label}>Email</span>
            <input required name="email" type="email" autoComplete="email" className={field} />
          </label>
          <label className="grid gap-1">
            <span className={label}>What would you like made?</span>
            <select
              name="commission"
              className={field}
              value={commissionType}
              onChange={(event) => {
                setCommissionType(event.currentTarget.value === "suit" ? "suit" : "top");
              }}
            >
              <option value="top">Custom top</option>
              <option value="suit">Custom suit</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className={label}>Occasion</span>
            <select name="occasion" className={field}>
              <option>Everyday</option>
              <option>Wedding</option>
              <option>Engagement</option>
              <option>Holiday / Meskel / Timket</option>
              <option>Graduation</option>
              <option>Work / formal</option>
              <option>Other</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className={label}>{commissionType === "suit" ? "Suit style" : "Top style"}</span>
            {commissionType === "suit" ? (
              <select name="type" className={field}>
                <option>Two-piece suit</option>
                <option>Single-breasted suit</option>
                <option>Double-breasted suit</option>
                <option>Tuxedo suit</option>
                <option>Wide-leg suit</option>
                <option>Other / full custom design</option>
              </select>
            ) : (
              <select name="type" className={field}>
                <option>One-shoulder top</option>
                <option>Square neck top</option>
                <option>Cowl neck top</option>
                <option>Corset-style top</option>
                <option>Cutout top</option>
                <option>Full custom design</option>
              </select>
            )}
          </label>
          <label className="grid gap-1">
            <span className={label}>Preferred colour</span>
            <input
              name="color"
              placeholder={
                commissionType === "suit" ? "Burgundy, navy, or a reference" : "Deep burgundy"
              }
              className={field}
            />
          </label>
          <label className="grid gap-1">
            <span className={label}>Preferred fabric</span>
            <input
              name="fabric"
              placeholder="Optional — we can recommend fabrics"
              className={field}
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className={label}>Budget</span>
            <select name="budget" className={field}>
              {commissionType === "suit" ? (
                <>
                  <option>ETB 8,000 – 12,000</option>
                  <option>ETB 12,000 – 20,000</option>
                  <option>ETB 20,000 – 35,000</option>
                  <option>ETB 35,000+</option>
                </>
              ) : (
                <>
                  <option>ETB 2,000 – 5,000</option>
                  <option>ETB 5,000 – 10,000</option>
                  <option>ETB 10,000 – 20,000</option>
                  <option>ETB 20,000+</option>
                </>
              )}
            </select>
          </label>
          <div className="sm:col-span-2">
            <span className={label}>
              {commissionType === "suit"
                ? "Suit measurements (cm) — optional, we can take them at your fitting"
                : "Measurements (cm) — optional, we can take them at your fitting"}
            </span>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {measurements.map((measurement) => (
                <input
                  key={measurement}
                  name={`measurement_${measurement.toLowerCase().replaceAll(" ", "_")}`}
                  aria-label={`${measurement} measurement in centimeters`}
                  placeholder={measurement}
                  inputMode="decimal"
                  className={field}
                />
              ))}
            </div>
          </div>
          {commissionType === "suit" ? (
            <label className="grid gap-1 sm:col-span-2">
              <span className={label}>Fit or alteration preferences</span>
              <select name="fit_preferences" className={field}>
                <option>No preference yet — advise me</option>
                <option>Close / tailored fit</option>
                <option>Relaxed fit</option>
                <option>Room for later alterations</option>
                <option>Discuss at fitting</option>
              </select>
            </label>
          ) : null}
          <label className="sm:col-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border px-6 py-10 text-center transition-colors hover:border-gold">
            <Upload className="h-5 w-5 text-gold" strokeWidth={1.25} />
            <span className={label}>Upload inspiration images</span>
            <span className="text-xs text-muted-foreground">
              {files.length
                ? files.map((file) => file.name).join(", ")
                : "JPG, PNG or WebP, up to 3 images. Uploaded privately."}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                const selected = Array.from(event.currentTarget.files ?? []);
                if (selected.length > 3) {
                  setNotice("Please choose no more than 3 inspiration images.");
                  setFiles(selected.slice(0, 3));
                  return;
                }
                if (selected.some((file) => file.size > 20 * 1024 * 1024)) {
                  setNotice("Each inspiration image must be smaller than 20 MB.");
                  setFiles([]);
                  return;
                }
                if (
                  selected.some(
                    (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
                  )
                ) {
                  setNotice("Choose JPG, PNG, or WebP inspiration images.");
                  setFiles([]);
                  return;
                }
                setNotice("");
                setFiles(selected);
              }}
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className={label}>Additional notes</span>
            <textarea
              name="notes"
              rows={4}
              className="w-full border-b border-border bg-transparent py-2 outline-hidden focus:border-gold"
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
            <input required type="checkbox" name="privacyConsent" className="mt-1 accent-gold" />
            <span>
              I agree that AHAB may store my contact details, measurements, and private inspiration
              images to respond to this commission, as described in the{" "}
              <Link to="/privacy" className="underline underline-offset-2">
                privacy policy
              </Link>
              .
            </span>
          </label>
          <AhabButton type="submit" size="lg" className="sm:col-span-2">
            {busy ? "Sending request…" : `Send my ${commissionType} request`}
          </AhabButton>
        </form>
      </section>
    </div>
  );
}
