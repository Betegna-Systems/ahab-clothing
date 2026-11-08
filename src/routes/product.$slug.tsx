import { ChatOrderButtons } from "@/components/site/ChatOrderButtons";
import { buildOrderMessage } from "@/lib/order-channels";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, RotateCw, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products";
import { fetchProductBySlug } from "@/lib/firestore-products";
import { breadcrumbJsonLd, productJsonLd, seo } from "@/lib/seo";
import { useShop } from "@/lib/shop-store";
import { ProductCard } from "@/components/site/ProductCard";
import { AhabButton } from "@/components/site/ui";
import { SizeChart } from "@/components/site/SizeChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getApprovedProductReviews } from "@/lib/orders.functions";
import { getProductVariantAvailability } from "@/lib/inventory.functions";
import { headT, useT } from "@/lib/i18n";
import { productText, useProductText } from "@/lib/i18n/product";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    // Always ask Firestore so edits made in the admin app show immediately; it falls back
    // to the last known catalog when Firestore is unreachable.
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    const [reviews, availableVariants] = await Promise.all([
      getApprovedProductReviews({ data: { productSlug: product.slug } }),
      getProductVariantAvailability({ data: { productSlug: product.slug } }),
    ]);
    const rating =
      reviews.length > 0
        ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
        : 0;
    return {
      product: {
        ...product,
        inStock: availableVariants.length > 0,
        rating,
        reviews: reviews.length,
      },
      reviews,
    };
  },
  head: ({ loaderData, match }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const { locale } = headT(match.context);
    const text = productText(p, locale);
    return seo(text.name, text.description.slice(0, 155), {
      path: `/product/${p.slug}`,
      locale,
      image: p.images[0],
      type: "product",
      jsonLd: [
        productJsonLd(p, undefined, loaderData?.reviews),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: p.name, path: `/product/${p.slug}` },
        ]),
      ],
    });
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  const t = useT();
  return (
    <div className="py-32 text-center">
      <h1 className="text-4xl">{t("This piece is no longer available.")}</h1>
      <Link to="/shop" className="label-xs link-underline mt-8 inline-block">
        {t("Back to the shop")}
      </Link>
    </div>
  );
}

const suitFitNotes: Record<string, string> = {
  "taitu-double-breasted-suit":
    "Sharp shoulders and a nipped waist pair with high-rise wide-leg trousers.",
  "menen-single-breasted-suit": "A clean one-button blazer with straight-leg trousers.",
  "zewditu-oversized-suit": "A relaxed oversized blazer with fluid wide-leg trousers.",
  "selam-cropped-suit": "A cropped blazer pairs with high-waisted pleated trousers.",
  "almaz-pinstripe-suit": "A nipped-waist blazer pairs with slim high-waisted trousers.",
  "aster-belted-wrap-suit":
    "A wrap-front blazer adjusts with its belt and pairs with wide-leg trousers.",
  "makeda-tuxedo-suit": "A fitted blazer with satin shawl lapels pairs with straight-leg trousers.",
  "genet-linen-suit": "An unstructured linen-blend blazer pairs with cropped trousers.",
  "birtukan-velvet-collar-suit": "A waist-tailored blazer with a velvet collar.",
  "senait-wide-leg-suit": "A fitted blazer pairs with floor-sweeping wide-leg trousers.",
};

function ProductPage() {
  const { product, reviews } = Route.useLoaderData();
  const navigate = useNavigate();
  const t = useT();
  const text = useProductText()(product);
  const {
    products: allProducts,
    addToCart,
    toggleWishlist,
    isWished,
    markViewed,
    recentlyViewed,
    setCartOpen,
    inventoryStatus,
    isVariantAvailable,
    hasAvailableColor,
  } = useShop();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0]! : null,
  );
  const [colorIndex, setColorIndex] = useState(0);
  const color = product.colors[colorIndex]?.name ?? product.colors[0]!.name;
  const variantAvailable = size !== null && isVariantAvailable(product.slug, color, size);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    markViewed(product.slug);
    setActive(0);
    setSize(product.sizes.length === 1 ? product.sizes[0]! : null);
    setColorIndex(0);
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!spinning) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % product.images.length), 700);
    return () => clearInterval(timer);
  }, [spinning, product.images.length]);

  const add = (open = true) => {
    if (!size) {
      toast.error(t("Please choose a size"));
      return false;
    }
    if (inventoryStatus !== "ready") {
      toast.error(t("Stock availability couldn't be checked. Please try again later."));
      return false;
    }
    if (!variantAvailable) {
      toast.error(t("That size and color are currently unavailable."));
      return false;
    }
    addToCart({ slug: product.slug, size, color, qty: 1 });
    if (!open) setCartOpen(false);
    return true;
  };

  const related = allProducts
    .filter(
      (p) => p.slug !== product.slug && p.categories.some((c) => product.categories.includes(c)),
    )
    .slice(0, 4);
  const viewed = recentlyViewed
    .filter((s) => s !== product.slug)
    .map((s) => allProducts.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 4);
  const wished = isWished(product.slug);
  const chatMessage = buildOrderMessage([
    {
      slug: product.slug,
      name: product.name,
      color,
      size: size ?? "?",
      qty: 1,
      price: product.price,
    },
  ]);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-16">
      <nav className="label-xs text-muted-foreground">
        <Link to="/shop" className="link-underline">
          {t("Shop")}
        </Link>{" "}
        / <span className="text-foreground">{text.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex gap-3 md:flex-col">
            {product.images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSpinning(false);
                  setActive(i);
                  setColorIndex(i);
                }}
                className={cn(
                  "w-16 overflow-hidden border md:w-20",
                  active === i
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img
                  src={src}
                  alt={t("{name} in {color}", {
                    name: text.name,
                    color: text.color(product.colors[i]?.name ?? ""),
                  })}
                  loading="lazy"
                  className="aspect-3/4 w-full object-cover"
                />
              </button>
            ))}
          </div>
          <div
            className="relative flex-1 cursor-zoom-in overflow-hidden bg-secondary"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              key={active}
              src={product.images[active]}
              alt={t("{name} in {color}", { name: text.name, color: text.color(color) })}
              className="fade-in-slow aspect-3/4 w-full object-cover transition-transform duration-300"
              style={
                zoom
                  ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
            />
            {product.images.length > 1 ? (
              <button
                type="button"
                onClick={() => setSpinning((s) => !s)}
                className="label-xs absolute bottom-4 left-4 flex items-center gap-2 bg-cream/90 px-4 py-2.5 backdrop-blur-sm"
              >
                <RotateCw
                  className={cn("h-3.5 w-3.5", spinning && "animate-spin")}
                  strokeWidth={1.5}
                />{" "}
                {spinning ? t("Stop") : t("360° view")}
              </button>
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.badge ? (
            <p className="label-xs text-gold">
              {product.badge === "bestseller"
                ? t("Best Seller")
                : product.badge === "new"
                  ? t("New Arrival")
                  : t("On Sale")}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{text.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-lg">{formatPrice(product.price)}</p>
            {product.compareAt ? (
              <p className="text-muted-foreground line-through">{formatPrice(product.compareAt)}</p>
            ) : null}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            {reviews.length ? (
              <>
                <span
                  className="flex"
                  aria-label={t("{rating} out of 5 stars", { rating: product.rating.toFixed(1) })}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "h-3.5 w-3.5",
                        index < Math.round(product.rating) ? "fill-gold text-gold" : "text-border",
                      )}
                    />
                  ))}
                </span>
                {reviews.length === 1
                  ? t("{count} verified review", { count: reviews.length })
                  : t("{count} verified reviews", { count: reviews.length })}
              </>
            ) : (
              t("No verified reviews yet")
            )}
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{text.description}</p>

          <div className="mt-8">
            <p className="label-xs">
              {t("Colour")} — <span className="text-muted-foreground">{text.color(color)}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  disabled={!hasAvailableColor(product, c.name)}
                  onClick={() => {
                    setColorIndex(i);
                    setSpinning(false);
                    setActive(i);
                  }}
                  aria-label={text.color(c.name)}
                  className={cn(
                    "h-9 w-9 rounded-full border-2",
                    colorIndex === i ? "border-gold" : "border-border",
                    !hasAvailableColor(product, c.name) && "cursor-not-allowed opacity-35",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="label-xs">{t("Size")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={!isVariantAvailable(product.slug, color, s)}
                  onClick={() => setSize(s)}
                  className={cn(
                    "label-xs min-w-12 border px-4 py-3 transition-colors",
                    size === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                    !isVariantAvailable(product.slug, color, s) &&
                      "cursor-not-allowed opacity-35 line-through",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {inventoryStatus === "loading"
                ? t("Checking size and color availability…")
                : inventoryStatus === "error"
                  ? t("Availability couldn't be checked. Please try again later.")
                  : size && !variantAvailable
                    ? t("This size and color are currently unavailable.")
                    : variantAvailable
                      ? t("In stock")
                      : t("Select an available size and color.")}
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="flex gap-3">
              <AhabButton
                size="lg"
                className="flex-1"
                onClick={() => add()}
                disabled={inventoryStatus !== "ready" || (size !== null && !variantAvailable)}
              >
                {t("Add to Cart")}
              </AhabButton>
              <button
                type="button"
                onClick={() => toggleWishlist(product.slug)}
                aria-label={t("Wishlist")}
                className="grid h-14 w-14 place-items-center border border-border hover:border-primary"
              >
                <Heart
                  className={cn("h-5 w-5", wished && "fill-gold text-gold")}
                  strokeWidth={1.25}
                />
              </button>
            </div>
            <AhabButton
              size="lg"
              variant="gold"
              disabled={inventoryStatus !== "ready" || (size !== null && !variantAvailable)}
              onClick={() => {
                if (add(false)) {
                  navigate({ to: "/checkout" });
                }
              }}
            >
              {t("Buy Now")}
            </AhabButton>
            <p className="label-xs mt-2 text-center text-muted-foreground">
              {t("Or order by chat")}
            </p>
            <ChatOrderButtons
              message={chatMessage}
              onBeforeOpen={() => {
                if (!size) {
                  toast.error(t("Please choose a size"));
                  return false;
                }
                if (inventoryStatus !== "ready") {
                  toast.error(t("Stock availability couldn't be checked. Please try again later."));
                  return false;
                }
                if (!variantAvailable) {
                  toast.error(t("That size and color are currently unavailable."));
                  return false;
                }
                return true;
              }}
            />
          </div>

          <Accordion type="single" collapsible className="mt-10 border-t border-border">
            <AccordionItem value="fabric">
              <AccordionTrigger className="label-xs">{t("Fabric")}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{text.fabric}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="label-xs">{t("Care")}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{text.care}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
              <AccordionTrigger className="label-xs">
                {product.categories.includes("suits") ? t("Suit size & fit") : t("Size guide")}
              </AccordionTrigger>
              <AccordionContent>
                {product.categories.includes("suits") ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t(
                        suitFitNotes[product.slug] ?? "For a suit-specific fit note, contact AHAB.",
                      )}{" "}
                      {t(
                        "The size chart shows body measurements, not finished garment measurements.",
                      )}
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t(
                        "For jacket or trouser measurements and possible alterations, contact AHAB before ordering so the team can confirm options for this suit.",
                      )}
                    </p>
                  </>
                ) : null}
                <SizeChart compact />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger className="label-xs">{t("Delivery")}</AccordionTrigger>
              <AccordionContent className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">{t("Addis Ababa:")}</strong>{" "}
                  {t("1–2 days, free over ETB 5,000.")}
                </p>
                <p>
                  <strong className="text-foreground">{t("Across Ethiopia:")}</strong>{" "}
                  {t("3–6 days via trusted courier.")}
                </p>
                <p>
                  <strong className="text-foreground">{t("International:")}</strong>{" "}
                  {t("coming soon — message us to arrange.")}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="mt-28">
        <h2 className="text-4xl">{t("Verified customer reviews")}</h2>
        {reviews.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {reviews.map((review, index) => (
              <article key={`${review.createdAt}-${index}`} className="border-t border-border pt-6">
                <span
                  className="flex"
                  aria-label={t("{rating} out of 5 stars", { rating: review.rating })}
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={cn(
                        "h-3.5 w-3.5",
                        starIndex < review.rating ? "fill-gold text-gold" : "text-border",
                      )}
                    />
                  ))}
                </span>
                <p className="mt-4 font-serif text-xl leading-snug">{review.reviewText}</p>
                {review.fitFeedback ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t("Fit: {fit}", { fit: review.fitFeedback })}
                  </p>
                ) : null}
                {review.photoUrl ? (
                  <img
                    src={review.photoUrl}
                    alt={t("Customer photo for {name}", { name: text.name })}
                    loading="lazy"
                    className="mt-4 max-h-80 object-cover"
                  />
                ) : null}
                <p className="label-xs mt-4 text-muted-foreground">
                  {t("{name} · Verified purchase", { name: review.reviewerName })}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 max-w-xl text-muted-foreground">
            {t("No customer reviews have been published for this piece yet.")}
          </p>
        )}
      </section>

      {related.length ? (
        <section className="mt-28">
          <h2 className="text-4xl">{t("You may also love")}</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {viewed.length ? (
        <section className="mt-28">
          <h2 className="text-4xl">{t("Recently viewed")}</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
            {viewed.map((p) => p && <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
