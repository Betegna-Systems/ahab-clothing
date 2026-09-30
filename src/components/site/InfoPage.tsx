import type { ReactNode } from "react";

export function InfoPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <p className="label-xs text-gold">{eyebrow}</p>
      <h1 className="mt-5 text-5xl leading-tight md:text-6xl">{title}</h1>
      <div className="mt-10 space-y-5 leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground">
        {children}
      </div>
    </div>
  );
}
