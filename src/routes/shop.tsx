import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, type Category } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const CATS: Category[] = ["women", "men", "kids", "traditional", "modern"];
type Sort = "newest" | "popular" | "price-asc" | "price-desc" | "rated";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { category?: Category } => ({
    category: CATS.includes(s.category as Category) ? (s.category as Category) : undefined,
  }),
  head: () => seo("Shop", "Shop traditional and modern Ethiopian clothing for women, men and kids — handmade in Addis Ababa."),
  component: Shop,
});

const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
const allColors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values());

function Shop() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(45000);
  const [sort, setSort] = useState<Sort>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    const r = products.filter(
      (p) =>
        (!category || p.categories.includes(category)) &&
        (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) &&
        (colors.length === 0 || p.colors.some((c) => colors.includes(c.name))) &&
        p.price <= maxPrice,
    );
    const sorters: Record<Sort, (a: (typeof r)[0], b: (typeof r)[0]) => number> = {
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      popular: (a, b) => b.popularity - a.popularity,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rated: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    };
    return [...r].sort(sorters[sort]);
  }, [category, sizes, colors, maxPrice, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const Filters = (
    <div className="space-y-10">
      <div>
        <h3 className="label-xs text-muted-foreground">Size</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button key={s} type="button" onClick={() => toggle(sizes, setSizes, s)}
              className={cn("label-xs min-w-11 border px-3 py-2 transition-colors", sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="label-xs text-muted-foreground">Colour</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {allColors.map((c) => (
            <button key={c.name} type="button" onClick={() => toggle(colors, setColors, c.name)} title={c.name} aria-label={c.name}
              className={cn("h-8 w-8 rounded-full border-2 transition-all", colors.includes(c.name) ? "border-gold scale-110" : "border-border")}
              style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="label-xs text-muted-foreground">Up to ETB {maxPrice.toLocaleString()}</h3>
        <input type="range" min={3000} max={45000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-4 w-full accent-gold" />
      </div>
      <button type="button" className="label-xs link-underline" onClick={() => { setSizes([]); setColors([]); setMaxPrice(45000); navigate({ search: {} }); }}>
        Clear all
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-20">
      <header className="text-center">
        <p className="label-xs text-gold">The Collection</p>
        <h1 className="mt-4 text-5xl capitalize md:text-7xl">{category ?? "All pieces"}</h1>
      </header>

      <nav className="mt-12 flex justify-center gap-6 overflow-x-auto border-b border-border pb-4 md:gap-10">
        {[undefined, ...CATS].map((c) => (
          <button key={c ?? "all"} type="button" onClick={() => navigate({ search: c ? { category: c } : {} })}
            className={cn("label-xs whitespace-nowrap pb-1 transition-colors", category === c ? "border-b border-primary text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {c ?? "All"}
          </button>
        ))}
      </nav>

      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={() => setFiltersOpen(true)} className="label-xs flex items-center gap-2 lg:hidden">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.25} /> Filter
        </button>
        <p className="label-xs hidden text-muted-foreground lg:block">{list.length} pieces</p>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="label-xs bg-transparent outline-hidden" aria-label="Sort by">
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rated">Best rated</option>
        </select>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 3} />)}
          {list.length === 0 ? <p className="col-span-full py-20 text-center font-serif text-2xl text-muted-foreground">No pieces match — try clearing a filter.</p> : null}
        </div>
      </div>

      <div className={cn("fixed inset-0 z-[70] bg-cream p-6 transition-transform duration-500 lg:hidden", filtersOpen ? "translate-y-0" : "translate-y-full")}>
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl">Filter</h2>
          <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X className="h-5 w-5" strokeWidth={1.25} /></button>
        </div>
        {Filters}
        <button type="button" onClick={() => setFiltersOpen(false)} className="label-xs mt-12 h-14 w-full bg-primary text-primary-foreground">
          Show {list.length} pieces
        </button>
      </div>
    </div>
  );
}
