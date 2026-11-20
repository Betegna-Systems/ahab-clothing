import { useRef, useState, type MouseEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useProductText } from "@/lib/i18n/product";
import { isPlainClick, tagProductPhoto } from "@/lib/view-transition";
import { useReveal } from "./reveal";

const badgeLabel: Record<string, string> = {
  new: "New",
  sale: "Sale",
  bestseller: "Best Seller",
};

export function ProductCard({
  product,
  priority,
  showPurchaseOptions = false,
  revealDelay = 0,
}: {
  product: Product;
  priority?: boolean;
  showPurchaseOptions?: boolean;
  /** Stagger (ms) for the scroll-in animation, e.g. by column position in a grid. */
  revealDelay?: number;
}) {
  const revealRef = useReveal<HTMLElement>(revealDelay);
  const photoRef = useRef<HTMLImageElement>(null);
  const morphPhoto = (e: MouseEvent) => {
    if (isPlainClick(e)) tagProductPhoto(photoRef.current);
  };
  const {
    toggleWishlist,
    isWished,
    addToCart,
    setCartOpen,
    inventoryStatus,
    isProductAvailable,
    isVariantAvailable,
  } = useShop();
  const navigate = useNavigate();
  const t = useT();
  const text = useProductText()(product);
  const wished = isWished(product.slug);
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const photo = product.images[colorIndex] ?? product.images[0];
  const color = product.colors[colorIndex] ?? product.colors[0];
  const count = product.images.length;
  const available = isProductAvailable(product);
  const availableSizes =
    color && inventoryStatus === "ready"
      ? product.sizes.filter((size) => isVariantAvailable(product.slug, color.name, size))
      : [];
  const purchaseSize =
    selectedSize && availableSizes.includes(selectedSize) ? selectedSize : availableSizes[0];

  const step = (dir: 1 | -1) => setColorIndex((i) => (i + dir + count) % count);
  const addSelected = (buyNow: boolean) => {
    if (!color || !purchaseSize) return;
    addToCart({ slug: product.slug, size: purchaseSize, color: color.name, qty: 1 });
    if (buyNow) {
      setCartOpen(false);
      void navigate({ to: "/checkout" });
    }
  };

  return (
    <article ref={revealRef} className="group relative">
      <div className="relative overflow-hidden bg-secondary">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          onClick={morphPhoto}
          className="block"
        >
          <div className="relative aspect-3/4">
            <img
              key={photo}
              ref={photoRef}
              src={photo}
              alt={t("{name} in {color}", {
                name: text.name,
                color: text.color(color?.name ?? ""),
              })}
              loading={priority ? "eager" : "lazy"}
              className="fade-in-slow absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
          </div>
        </Link>

        {product.badge ? (
          <span className="label-xs absolute left-4 top-4 bg-cream px-3 py-1.5 text-foreground">
            {t(badgeLabel[product.badge] ?? "")}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.slug);
            toast(wished ? t("Removed from wishlist") : t("Saved to wishlist"), {
              description: text.name,
            });
          }}
          aria-label={wished ? t("Remove from wishlist") : t("Save to wishlist")}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center bg-cream/85 text-foreground backdrop-blur-sm transition-colors hover:bg-cream"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} strokeWidth={1.25} />
        </button>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("Previous colour")}
              className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center bg-cream/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-cream group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("Next colour")}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center bg-cream/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-cream group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </>
        ) : null}

        {/* Quick add: always visible (phones have no hover) and always asks for a size. */}
        {quickAddOpen ? (
          <div
            className="absolute inset-x-0 bottom-0 bg-cream/95 p-3 backdrop-blur-sm"
            role="group"
            aria-label={t("Choose a size")}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="label-xs text-muted-foreground">{t("Choose a size")}</p>
              <button
                type="button"
                onClick={() => setQuickAddOpen(false)}
                aria-label={t("Close")}
                className="grid h-7 w-7 place-items-center text-foreground/70 hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            {inventoryStatus === "ready" && availableSizes.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.sizes.map((size) => {
                  const inStock = availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={() => {
                        if (!color) return;
                        addToCart({ slug: product.slug, size, color: color.name, qty: 1 });
                        setQuickAddOpen(false);
                      }}
                      aria-label={t("Add size {size} to bag", { size })}
                      className="label-xs min-h-9 min-w-9 border border-border bg-cream px-2 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-cream disabled:hover:text-foreground"
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                {inventoryStatus === "loading"
                  ? t("Checking stock availability…")
                  : inventoryStatus === "error"
                    ? t("Stock couldn't be checked. Try again later.")
                    : t("Currently unavailable in this color.")}
              </p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setQuickAddOpen(true)}
            aria-label={t("Quick add {name}", { name: text.name })}
            aria-expanded={false}
            className="label-xs absolute bottom-3 right-3 flex h-10 min-w-10 items-center justify-center gap-2 bg-cream/90 px-3 text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">{t("Quick add")}</span>
          </button>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl leading-tight">
            <Link to="/product/$slug" params={{ slug: product.slug }} onClick={morphPhoto}>
              {text.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {inventoryStatus === "loading"
              ? t("Checking stock")
              : inventoryStatus === "error"
                ? t("Stock unavailable")
                : available
                  ? t("In stock")
                  : t("Sold out")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">{formatPrice(product.price)}</p>
          {product.compareAt ? (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className="mt-3 flex items-center gap-2.5"
        role="group"
        aria-label={t("Available colours")}
      >
        {product.colors.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setColorIndex(i)}
            title={text.color(c.name)}
            aria-label={t("Show {name} in {color}", { name: text.name, color: text.color(c.name) })}
            aria-pressed={colorIndex === i}
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-all",
              colorIndex === i ? "scale-110 border-gold" : "border-border hover:border-gold/60",
            )}
            style={{ backgroundColor: c.hex }}
          />
        ))}
        <span className="label-xs ml-1 text-muted-foreground">
          {color ? text.color(color.name) : null}
        </span>
      </div>

      {showPurchaseOptions ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="label-xs text-muted-foreground">{t("Choose a size")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const inStock = availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={inventoryStatus !== "ready" || !inStock}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={purchaseSize === size}
                    className={cn(
                      "label-xs min-w-10 border px-3 py-2",
                      purchaseSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border",
                      (!inStock || inventoryStatus !== "ready") &&
                        "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
          {inventoryStatus !== "ready" || !purchaseSize ? (
            <p className="text-xs text-muted-foreground">
              {inventoryStatus === "loading"
                ? t("Checking stock availability…")
                : inventoryStatus === "error"
                  ? t("Stock couldn't be checked. Try again later.")
                  : t("Currently unavailable in this color.")}
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => addSelected(false)}
                className="label-xs min-h-11 bg-primary px-4 text-primary-foreground hover:bg-gold hover:text-gold-foreground"
              >
                {t("Add to bag")}
              </button>
              <button
                type="button"
                onClick={() => addSelected(true)}
                className="label-xs min-h-11 border border-primary/40 px-4 hover:border-primary"
              >
                {t("Buy now")}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
