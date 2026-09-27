import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { AhabLink } from "./ui";

const FREE_SHIPPING = 5000;
const PROMOS: Record<string, number> = { AHAB10: 0.1, MADEWITHLOVE: 0.15 };

export function CartDrawer() {
  const { cartOpen, setCartOpen, lineItems, removeLine, setQty, subtotal } = useShop();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : 250;
  const total = Math.round(subtotal * (1 - discount)) + shipping;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] transition-opacity duration-500",
        cartOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        className="absolute inset-0 bg-foreground/35 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream transition-transform duration-500 ease-out",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-2xl">Your bag</h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {lineItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-2xl">Your bag is empty.</p>
            <p className="text-sm text-muted-foreground">
              Begin with the pieces our customers return for.
            </p>
            <AhabLink to="/shop" onClick={() => setCartOpen(false)}>
              Shop the collection
            </AhabLink>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {subtotal < FREE_SHIPPING ? (
                <p className="border-b border-border py-4 text-xs text-muted-foreground">
                  Add {formatPrice(FREE_SHIPPING - subtotal)} for free Addis Ababa delivery.
                </p>
              ) : null}
              <ul className="divide-y divide-border">
                {lineItems.map(({ line, product }, i) => (
                  <li key={`${line.slug}-${line.size}-${line.color}`} className="flex gap-4 py-5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-28 w-22 object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.slug }}
                          onClick={() => setCartOpen(false)}
                          className="font-serif text-lg leading-tight"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeLine(i)}
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4 text-muted-foreground" strokeWidth={1.25} />
                        </button>
                      </div>
                      <p className="label-xs mt-1 text-muted-foreground">
                        {line.size} · {line.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(i, line.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-9 w-9 place-items-center"
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-sm">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(i, line.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid h-9 w-9 place-items-center"
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Promo code"
                  className="label-xs h-11 flex-1 border border-border bg-transparent px-4 outline-hidden focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const rate = PROMOS[promo.trim().toUpperCase()];
                    if (rate) {
                      setDiscount(rate);
                      toast.success(`${rate * 100}% applied`);
                    } else {
                      toast.error("That code isn't recognised");
                    }
                  }}
                  className="label-xs h-11 border border-primary px-5 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Apply
                </button>
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-gold">
                    <dt>Discount</dt>
                    <dd>−{formatPrice(Math.round(subtotal * discount))}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated delivery</dt>
                  <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-serif text-lg">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              <AhabLink
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="mt-5 w-full"
                size="lg"
              >
                Checkout
              </AhabLink>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
