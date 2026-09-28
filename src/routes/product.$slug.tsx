import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, RotateCw, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, getProduct, products } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { ProductCard } from "@/components/site/ProductCard";
import { AhabButton } from "@/components/site/ui";
import { SizeChart } from "@/components/site/SizeChart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const title = `${p.name} — AHAB Clothing`;
    return {
      meta: [
        { title },
        { name: "description", content: p.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            brand: { "@type": "Brand", name: "AHAB Clothing" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
            offers: { "@type": "Offer", priceCurrency: "ETB", price: p.price, availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="text-4xl">This piece is no longer available.</h1>
      <Link to="/shop" className="label-xs link-underline mt-8 inline-block">Back to the shop</Link>
    </div>
  ),
  component: ProductPage,
});

const reviews = [
  { name: "Meron K.", rating: 5, text: "The weaving is even more beautiful in person. It fit exactly as the size guide said." },
  { name: "Liya B.", rating: 5, text: "Arrived beautifully wrapped within two days in Addis. I felt like I'd been given a gift." },
  { name: "Dawit M.", rating: 4, text: "Wonderful quality. I sized up for a more relaxed fit and I'm glad I did." },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWished, markViewed, recentlyViewed, setCartOpen } = useShop();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState(product.colors[0].name);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    markViewed(product.slug);
    setActive(0);
    setSize(product.sizes.length === 1 ? product.sizes[0] : null);
    setColor(product.colors[0].name);
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!spinning) return;
    const t = setInterval(() => setActive((a) => (a + 1) % product.images.length), 700);
    return () => clearInterval(t);
  }, [spinning, product.images.length]);

  const add = (open = true) => {
    if (!size) { toast.error("Please choose a size"); return false; }
    addToCart({ slug: product.slug, size, color, qty: 1 });
    if (!open) setCartOpen(false);
    return true;
  };

  const related = products.filter((p) => p.slug !== product.slug && p.categories.some((c) => product.categories.includes(c))).slice(0, 4);
  const viewed = recentlyViewed.filter((s) => s !== product.slug).map((s) => products.find((p) => p.slug === s)).filter(Boolean).slice(0, 4);
  const wished = isWished(product.slug);
  const whatsapp = `https://wa.me/251911000000?text=${encodeURIComponent(`Hello AHAB, I'd like to order the ${product.name} (size ${size ?? "?"}, ${color}).`)}`;

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-16">
      <nav className="label-xs text-muted-foreground">
        <Link to="/shop" className="link-underline">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex gap-3 md:flex-col">
            {product.images.map((src, i) => (
              <button key={i} type="button" onClick={() => { setSpinning(false); setActive(i); }}
                className={cn("w-16 overflow-hidden border md:w-20", active === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100")}>
                <img src={src} alt="" loading="lazy" className="aspect-3/4 w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 cursor-zoom-in overflow-hidden bg-secondary"
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
            onMouseLeave={() => setZoom(null)}>
            <img key={active} src={product.images[active]} alt={product.name}
              className="fade-in-slow aspect-3/4 w-full object-cover transition-transform duration-300"
              style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            {product.images.length > 1 ? (
              <button type="button" onClick={() => setSpinning((s) => !s)}
                className="label-xs absolute bottom-4 left-4 flex items-center gap-2 bg-cream/90 px-4 py-2.5 backdrop-blur-sm">
                <RotateCw className={cn("h-3.5 w-3.5", spinning && "animate-spin")} strokeWidth={1.5} /> {spinning ? "Stop" : "360° view"}
              </button>
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {product.badge ? <p className="label-xs text-gold">{product.badge === "bestseller" ? "Best Seller" : product.badge === "new" ? "New Arrival" : "On Sale"}</p> : null}
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-lg">{formatPrice(product.price)}</p>
            {product.compareAt ? <p className="text-muted-foreground line-through">{formatPrice(product.compareAt)}</p> : null}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("h-3.5 w-3.5", i < product.rating ? "fill-gold text-gold" : "text-border")} />)}</span>
            {product.reviews} reviews
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <p className="label-xs">Colour — <span className="text-muted-foreground">{color}</span></p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button key={c.name} type="button" onClick={() => setColor(c.name)} aria-label={c.name}
                  className={cn("h-9 w-9 rounded-full border-2", color === c.name ? "border-gold" : "border-border")} style={{ backgroundColor: c.hex }} />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="label-xs">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)}
                  className={cn("label-xs min-w-12 border px-4 py-3 transition-colors", size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{product.inStock ? "In stock — ships in 2–3 days" : "Made to order — 3 weeks"}</p>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="flex gap-3">
              <AhabButton size="lg" className="flex-1" onClick={() => add()}>Add to Cart</AhabButton>
              <button type="button" onClick={() => toggleWishlist(product.slug)} aria-label="Wishlist" className="grid h-14 w-14 place-items-center border border-border hover:border-primary">
                <Heart className={cn("h-5 w-5", wished && "fill-gold text-gold")} strokeWidth={1.25} />
              </button>
            </div>
            <AhabButton size="lg" variant="gold" onClick={() => { if (add(false)) window.location.assign("/checkout"); }}>Buy Now</AhabButton>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="label-xs flex h-14 items-center justify-center gap-2 border border-primary/40 transition-colors hover:bg-secondary">
              <MessageCircle className="h-4 w-4" strokeWidth={1.25} /> Order via WhatsApp
            </a>
          </div>

          <Accordion type="single" collapsible className="mt-10 border-t border-border">
            <AccordionItem value="fabric"><AccordionTrigger className="label-xs">Fabric</AccordionTrigger><AccordionContent className="text-muted-foreground">{product.fabric}</AccordionContent></AccordionItem>
            <AccordionItem value="care"><AccordionTrigger className="label-xs">Care</AccordionTrigger><AccordionContent className="text-muted-foreground">{product.care}</AccordionContent></AccordionItem>
            <AccordionItem value="size"><AccordionTrigger className="label-xs">Size guide</AccordionTrigger><AccordionContent><SizeChart compact /></AccordionContent></AccordionItem>
            <AccordionItem value="delivery"><AccordionTrigger className="label-xs">Delivery</AccordionTrigger><AccordionContent className="space-y-2 text-muted-foreground">
              <p><strong className="text-foreground">Addis Ababa:</strong> 1–2 days, free over ETB 5,000.</p>
              <p><strong className="text-foreground">Across Ethiopia:</strong> 3–6 days via trusted courier.</p>
              <p><strong className="text-foreground">International:</strong> coming soon — message us to arrange.</p>
            </AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-28">
        <h2 className="text-4xl">Reviews</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="border-t border-border pt-6">
              <span className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-gold text-gold" : "text-border")} />)}</span>
              <p className="mt-4 font-serif text-xl leading-snug">“{r.text}”</p>
              <p className="label-xs mt-4 text-muted-foreground">{r.name} · Verified buyer</p>
            </div>
          ))}
        </div>
      </section>

      {related.length ? (
        <section className="mt-28">
          <h2 className="text-4xl">You may also love</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        </section>
      ) : null}

      {viewed.length ? (
        <section className="mt-28">
          <h2 className="text-4xl">Recently viewed</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">{viewed.map((p) => p && <ProductCard key={p.slug} product={p} />)}</div>
        </section>
      ) : null}
    </div>
  );
}
