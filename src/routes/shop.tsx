import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { type Category, inCategory } from "@/lib/products";
import {
  fetchAllFirestoreProducts,
  getAllProductsCached,
  useAllProducts,
} from "@/lib/firestore-products";
import { ProductCard } from "@/components/site/ProductCard";
import { collectionJsonLd, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { headT, useT } from "@/lib/i18n";
import { useProductText } from "@/lib/i18n/product";

const CATS: Category[] = [
  "suits",
  "tops",
  "sleeveless",
  "long-sleeve",
  "one-shoulder",
  "off-shoulder",
  "cutout",
  "basics",
];
const LABEL: Record<Category, string> = {
  sleeveless: "Sleeveless",
  "long-sleeve": "Long Sleeve",
  "one-shoulder": "One Shoulder",
  "off-shoulder": "Off Shoulder",
  cutout: "Cutouts",
  basics: "Basics",
  suits: "Suits",
  tops: "Tops",
};
type Sort = "newest" | "popular" | "price-asc" | "price-desc" | "rated";
const MAX_PRICE = 12000;

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { category?: Category | undefined } => ({
    category: CATS.includes(s["category"] as Category) ? (s["category"] as Category) : undefined,
  }),
  // Structured data lists the live catalog; fetched only when rendering on the server so
  // client-side navigation to the shop stays instant.
  loader: async () => {
    if (typeof window === "undefined") await fetchAllFirestoreProducts();
    return {
      catalog: getAllProductsCached().map(({ slug, name }) => ({ slug, name })),
    };
  },
  head: ({ loaderData, match }) => {
    const { t, locale } = headT(match.context);
    return seo(
      t("Shop"),
      t(
        "Shop AHAB Suits and bodycon tops — tailored women's suits and sculpted tops, made in Addis Ababa.",
      ),
      {
        path: "/shop",
        locale,
        jsonLd: collectionJsonLd(undefined, loaderData?.catalog),
      },
    );
  },
  component: Shop,
});

const allSizes = ["XS", "S", "M", "L", "XL"];

function Shop() {
  const { products } = useAllProducts();
  const t = useT();
  const text = useProductText();
  // One swatch per English colour name; the label is the first translated name found.
  const allColors = Array.from(
    products
      .reduce((map, p) => {
        for (const c of p.colors) {
          const label = text(p).color(c.name);
          const seen = map.get(c.name);
          if (!seen || (seen.label === c.name && label !== c.name))
            map.set(c.name, { ...c, label });
        }
        return map;
      }, new Map<string, { name: string; hex: string; label: string }>())
      .values(),
  );
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<Sort>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    const r = products.filter(
      (p) =>
        (!category || inCategory(p, category)) &&
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
  }, [products, category, sizes, colors, maxPrice, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const Filters = (
    <div className="space-y-10">
      <div>
        <h3 className="label-xs text-muted-foreground">{t("Size")}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(sizes, setSizes, s)}
              className={cn(
                "label-xs min-w-11 border px-3 py-2 transition-colors",
                sizes.includes(s)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="label-xs text-muted-foreground">{t("Colour")}</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {allColors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => toggle(colors, setColors, c.name)}
              title={c.label}
              aria-label={c.label}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                colors.includes(c.name) ? "border-gold scale-110" : "border-border",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="label-xs text-muted-foreground">
          {t("Up to ETB {amount}", { amount: maxPrice.toLocaleString() })}
        </h3>
        <input
          type="range"
          min={1500}
          max={MAX_PRICE}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-4 w-full accent-gold"
        />
      </div>
      <button
        type="button"
        className="label-xs link-underline"
        onClick={() => {
          setSizes([]);
          setColors([]);
          setMaxPrice(MAX_PRICE);
          navigate({ search: {} });
        }}
      >
        {t("Clear all")}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-20">
      <header className="text-center">
        <p className="label-xs text-gold">{t("The Collection")}</p>
        <h1 className="mt-4 text-5xl capitalize md:text-7xl">
          {category ? t(LABEL[category]) : t("All pieces")}
        </h1>
      </header>

      <nav className="mt-12 flex justify-center gap-6 overflow-x-auto border-b border-border pb-4 md:gap-10">
        {[undefined, ...CATS].map((c) => (
          <button
            key={c ?? "all"}
            type="button"
            onClick={() => navigate({ search: c ? { category: c } : {} })}
            className={cn(
              "label-xs whitespace-nowrap pb-1 transition-colors",
              category === c
                ? "border-b border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c ? t(LABEL[c]) : t("All")}
          </button>
        ))}
      </nav>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="label-xs flex items-center gap-2 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.25} /> {t("Filter")}
        </button>
        <p className="label-xs hidden text-muted-foreground lg:block">
          {t("{count} pieces", { count: list.length })}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="label-xs bg-transparent outline-hidden"
          aria-label={t("Sort by")}
        >
          <option value="newest">{t("Newest")}</option>
          <option value="popular">{t("Popular")}</option>
          <option value="price-asc">{t("Price: low to high")}</option>
          <option value="price-desc">{t("Price: high to low")}</option>
          <option value="rated">{t("Best rated")}</option>
        </select>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
          {list.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 3} />
          ))}
          {list.length === 0 ? (
            <p className="col-span-full py-20 text-center font-serif text-2xl text-muted-foreground">
              {t("No pieces match — try clearing a filter.")}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[70] bg-cream p-6 transition-transform duration-500 lg:hidden",
          filtersOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl">{t("Filter")}</h2>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label={t("Close filters")}
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
        {Filters}
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="label-xs mt-12 h-14 w-full bg-primary text-primary-foreground"
        >
          {t("Show {count} pieces", { count: list.length })}
        </button>
      </div>
    </div>
  );
}
