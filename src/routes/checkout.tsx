import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { seo } from "@/lib/seo";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { AhabButton, AhabLink } from "@/components/site/ui";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Complete your AHAB order — delivery details and order summary."),
  component: CheckoutPage,
});

const field = "h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-primary";

function CheckoutPage() {
  const { lineItems, subtotal, clearCart } = useShop();
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <p className="label-xs text-gold">Thank you</p>
        <h1 className="mt-5 text-5xl">Your order is placed.</h1>
        <p className="mt-6 text-muted-foreground">We'll be in touch shortly to confirm delivery and payment.</p>
        <div className="mt-10"><AhabLink to="/shop">Continue shopping</AhabLink></div>
      </div>
    );
  }

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="text-5xl">Your bag is empty.</h1>
        <div className="mt-10"><AhabLink to="/shop">Discover the collection</AhabLink></div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1200px] gap-16 px-5 py-20 md:px-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={submit} className="space-y-5">
        <p className="label-xs text-gold">Checkout</p>
        <h1 className="text-5xl">Delivery details</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <input required placeholder="First name" className={field} />
          <input required placeholder="Last name" className={field} />
        </div>
        <input required type="email" placeholder="Email" className={field} />
        <input required type="tel" placeholder="Phone" className={field} />
        <input required placeholder="Address" className={field} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input required placeholder="City" className={field} defaultValue="Addis Ababa" />
          <input required placeholder="Country" className={field} defaultValue="Ethiopia" />
        </div>
        <p className="text-sm text-muted-foreground">Payment is arranged on confirmation — cash on delivery, Telebirr or bank transfer.</p>
        <AhabButton type="submit" size="lg" className="w-full">Place order</AhabButton>
      </form>

      <aside className="h-fit bg-secondary p-8">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="mt-6 space-y-4">
          {lineItems.map(({ line, product }, i) => (
            <li key={i} className="flex gap-4">
              <img src={product.images[0]} alt={product.name} className="h-20 w-16 object-cover" />
              <div className="flex-1 text-sm">
                <Link to="/product/$slug" params={{ slug: product.slug }} className="font-serif text-base">{product.name}</Link>
                <p className="text-muted-foreground">{line.color} · {line.size} · ×{line.qty}</p>
              </div>
              <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
          <div className="flex justify-between font-serif text-xl"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
