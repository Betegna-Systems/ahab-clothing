import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { formatPrice, products } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        [p.name, ...p.categories, ...p.colors.map((c) => c.name), p.fabric]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 6);
  }, [q]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] transition-opacity duration-400",
        searchOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative mx-auto max-w-3xl bg-cream px-6 py-8 shadow-lift sm:px-10 sm:py-10">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.25} />
          <input
            autoFocus={searchOpen}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dresses, linen, gold, traditional…"
            className="w-full bg-transparent font-serif text-2xl outline-hidden placeholder:text-muted-foreground/70"
          />
          <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {q && results.length === 0 ? (
          <p className="pt-8 text-sm text-muted-foreground">
            Nothing matched. Try “kemis”, “linen” or “gold”.
          </p>
        ) : null}

        <ul className="divide-y divide-border">
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                to="/product/$slug"
                params={{ slug: p.slug }}
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-5 py-4"
              >
                <img
                  src={p.images[0]}
                  alt=""
                  loading="lazy"
                  className="h-20 w-16 object-cover"
                />
                <span className="flex-1">
                  <span className="block font-serif text-lg">{p.name}</span>
                  <span className="label-xs text-muted-foreground">
                    {p.categories.join(" · ")}
                  </span>
                </span>
                <span className="text-sm">{formatPrice(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>

        {!q ? (
          <div className="pt-8">
            <p className="label-xs text-muted-foreground">Popular searches</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Habesha kemis", "Linen suit", "Netela", "Bridal", "Kids"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQ(term)}
                  className="label-xs border border-border px-4 py-2 transition-colors hover:border-gold hover:text-gold"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
