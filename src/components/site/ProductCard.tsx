import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

const badgeLabel: Record<string, string> = {
  new: "New",
  sale: "Sale",
  bestseller: "Best Seller",
};

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { toggleWishlist, isWished, addToCart } = useShop();
  const wished = isWished(product.slug);
  const second = product.images[1] ?? product.images[0];

  return (
    <article className="group relative">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-secondary"
      >
        <div className="relative aspect-3/4">
          <img
            src={product.images[0]}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.03] group-hover:opacity-0"
          />
          <img
            src={second}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[1200ms] ease-out group-hover:scale-[1.03] group-hover:opacity-100"
          />
        </div>
      </Link>

      {product.badge ? (
        <span className="label-xs absolute left-4 top-4 bg-cream px-3 py-1.5 text-foreground">
          {badgeLabel[product.badge]}
        </span>
      ) : null}

      <button
        type="button"
        onClick={() => {
          toggleWishlist(product.slug);
          toast(wished ? "Removed from wishlist" : "Saved to wishlist", {
            description: product.name,
          });
        }}
        aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center bg-cream/85 text-foreground backdrop-blur-sm transition-colors hover:bg-cream"
      >
        <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} strokeWidth={1.25} />
      </button>

      <button
        type="button"
        onClick={() =>
          addToCart({
            slug: product.slug,
            size: product.sizes[0],
            color: product.colors[0].name,
            qty: 1,
          })
        }
        className="label-xs absolute inset-x-0 bottom-0 flex h-12 translate-y-full items-center justify-center gap-2 bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Quick add
      </button>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl leading-tight">
            <Link to="/product/$slug" params={{ slug: product.slug }}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {product.inStock ? "In stock" : "Made to order"}
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
    </article>
  );
}
