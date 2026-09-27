import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ahabButton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 label-xs",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground",
        outline:
          "border border-primary/40 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground",
        ghostLight:
          "border border-cream/60 text-cream hover:bg-cream hover:text-foreground backdrop-blur-[2px]",
        gold: "bg-gold text-gold-foreground hover:bg-primary hover:text-primary-foreground",
        quiet: "text-foreground link-underline",
      },
      size: {
        md: "h-12 px-8",
        sm: "h-10 px-5",
        lg: "h-14 px-10",
        none: "",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

type BtnVariants = VariantProps<typeof ahabButton>;

export function AhabButton({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & BtnVariants) {
  return <button className={cn(ahabButton({ variant, size }), className)} {...props} />;
}

export function AhabLink({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & BtnVariants) {
  return <Link className={cn(ahabButton({ variant, size }), className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("label-xs inline-flex items-center gap-3 text-gold", className)}>
      <span className="h-px w-8 bg-gold" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-5 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{copy}</p>
      ) : null}
    </div>
  );
}
