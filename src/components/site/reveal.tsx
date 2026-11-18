import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades an element up into place the first time it scrolls into view.
 *
 * Server-rendered markup is always visible: the element is only hidden after hydration,
 * and only if it is still below the fold, so nothing flashes and no-JS visitors see
 * everything. Visitors who prefer reduced motion never get the hidden state.
 */
export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at load: leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;

    if (delayMs) el.style.setProperty("--reveal-delay", `${delayMs}ms`);
    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return ref;
}

export function Reveal({
  children,
  className,
  style,
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  /** "up" fades and rises; "curtain" uncovers a photo from the bottom edge as it settles. */
  variant?: "up" | "curtain";
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <div
      ref={ref}
      className={cn(variant === "curtain" && "reveal-curtain", className)}
      style={style}
    >
      {children}
    </div>
  );
}
