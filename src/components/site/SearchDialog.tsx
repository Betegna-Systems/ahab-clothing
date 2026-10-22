import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useAllProducts } from "@/lib/firestore-products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useShop();
  const { products } = useAllProducts();
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
  }, [q, products]);

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
            placeholder="Search tops, ribbed, one shoulder…"
            className="w-full bg-transparent font-serif text-2xl outline-hidden placeholder:text-muted-foreground/70"
          />
          <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid divide-y divide-border">
            {results.map((p) => (
              <Link
                key={p.slug}
                to="/product/$slug"
                params={{ slug: p.slug }}
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-16 w-12 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-serif text-lg">{p.name}</h4>
                  <p className="label-xs text-muted-foreground">
                    {p.categories.join(" · ")}
                  </p>
                </div>
                <p className="label-xs">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        ) : q.trim() ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No pieces found matching “{q}”.
          </p>
        ) : null}
      </div>
    </div>
  );
}
