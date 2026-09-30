import { useState } from "react";
import { cn } from "@/lib/utils";

const rows = [
  { size: "XS", bust: [80, 84], waist: [62, 66], hips: [86, 90] },
  { size: "S", bust: [84, 88], waist: [66, 70], hips: [90, 94] },
  { size: "M", bust: [88, 94], waist: [70, 76], hips: [94, 100] },
  { size: "L", bust: [94, 100], waist: [76, 82], hips: [100, 106] },
  { size: "XL", bust: [100, 108], waist: [82, 90], hips: [106, 114] },
];

export function SizeChart({ compact }: { compact?: boolean }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [picked, setPicked] = useState<string | null>(null);
  const f = (n: number) => (unit === "cm" ? n : Math.round(n / 2.54));
  const fmt = ([a = 0, b = 0]: number[]) => `${f(a)}–${f(b)}`;

  return (
    <div>
      <div className="flex gap-2">
        {(["cm", "in"] as const).map((u) => (
          <button key={u} type="button" onClick={() => setUnit(u)} className={cn("label-xs border px-3 py-1.5", unit === u ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{u}</button>
        ))}
      </div>
      <table className="mt-4 w-full text-left text-sm">
        <thead className="label-xs text-muted-foreground">
          <tr><th className="py-2">Size</th><th>Bust</th><th>Waist</th><th>Hips</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.size} onClick={() => setPicked(r.size)} className={cn("cursor-pointer border-t border-border transition-colors hover:bg-secondary", picked === r.size && "bg-secondary")}>
              <td className="py-3 font-medium">{r.size}</td><td>{fmt(r.bust)}</td><td>{fmt(r.waist)}</td><td>{fmt(r.hips)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!compact ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ["Bust", "Measure around the fullest part of your chest, keeping the tape level under your arms."],
            ["Waist", "Measure around your natural waistline — the narrowest part of your torso."],
            ["Hips", "Stand with feet together and measure around the fullest part of your hips."],
          ].map(([t, d]) => (
            <div key={t}><h3 className="font-serif text-2xl">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
