import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useProductText } from "@/lib/i18n/product";

const badgeLabel: Record<string, string> = {
  new: "New",
  sale: "Sale",
  bestseller: "Best Seller",
};

export function ProductCard({
  product,
  priority,
  showPurchaseOptions = false,
}: {
  product: Product;
  priority?: boolean;
  showPurchaseOptions?: boolean;
}) {
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
  const photo = product.images[colorIndex] ?? product.images[0];
  const color = product.colors[colorIndex] ?? product.colors[0];
  const count = product.images.length;
  const available = isProductAvailable(product);
  const availableSizes =
    color && inventoryStatus === "ready"
      ? product.sizes.filter((size) => isVariantAvailable(product.slug, color.name, size))
      : [];
  const quickAddSize = availableSizes[0];
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
    <article className="group relative">
      <div className="relative overflow-hidden bg-secondary">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
          <div className="relative aspect-3/4">
            <img
              key={photo}
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

        <button
          type="button"
          onClick={() =>
            addToCart({
              slug: product.slug,
              size: quickAddSize ?? "",
              color: color?.name ?? "",
              qty: 1,
            })
          }
          disabled={inventoryStatus !== "ready" || !quickAddSize}
          className="label-xs absolute inset-x-0 bottom-0 flex h-12 translate-y-full items-center justify-center gap-2 bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> {t("Quick add")}
        </button>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl leading-tight">
            <Link to="/product/$slug" params={{ slug: product.slug }}>
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
