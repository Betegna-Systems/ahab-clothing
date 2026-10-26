import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { seo } from "@/lib/seo";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { ChatOrderButtons } from "@/components/site/ChatOrderButtons";
import { buildOrderMessage, submitOrder, type OrderLine } from "@/lib/order-channels";
import { PAYMENT_METHODS, getPaymentMethod } from "@/lib/payment-methods";
import { toast } from "sonner";

function CopyAccount({ value }: { value: string }) {
  return (
    <span className="mt-2 flex items-center gap-3">
      <span className="font-mono text-base text-foreground">{value}</span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(value).then(
            () => toast.success("Copied"),
            () => toast.error("Copy is unavailable in this browser."),
          );
        }}
        className="label-xs border border-border px-2 py-1 hover:border-primary"
      >
        Copy
      </button>
    </span>
  );
}

export const Route = createFileRoute("/checkout")({
  head: () =>
    seo("Checkout", "Complete your AHAB order — delivery details and order summary.", {
      path: "/checkout",
      index: false,
    }),
  component: CheckoutPage,
});

const field = "h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-primary";

function CheckoutPage() {
  const { lineItems, subtotal, discount, promoCode, clearCart } = useShop();
  const [placed, setPlaced] = useState<{ number: string; message: string } | null>(null);
  const [payment, setPayment] = useState("cod");
  const [sending, setSending] = useState(false);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount + shipping;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const items: OrderLine[] = lineItems.map(({ line, product }) => {
      const colorIdx = product.colors.findIndex(
        (c) => c.name.toLowerCase() === line.color.toLowerCase(),
      );
      return {
        name: product.name,
        color: line.color,
        size: line.size,
        qty: line.qty,
        price: product.price,
        image: product.images[colorIdx >= 0 ? colorIdx : 0] ?? product.images[0] ?? "",
      };
    });
    const number = `AHAB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const name = `${g("first")} ${g("last")}`;
    const selectedPayment = getPaymentMethod(payment)!;
    const paymentLabel = selectedPayment.label;
    const paymentAccessToken = payment === "cod" ? undefined : crypto.randomUUID();
    setSending(true);
    const ok = await submitOrder({
      orderNumber: number,
      createdAt: new Date().toISOString(),
      customer: {
        name,
        email: g("email"),
        phone: g("phone"),
        address: g("address"),
        subCity: g("subCity"),
        city: g("city"),
      },
      items,
      subtotal,
      shipping,
      total,
      paymentMethod: paymentLabel,
      ...(paymentAccessToken ? { paymentAccessToken } : {}),
      notes: g("notes"),
    });
    setSending(false);
    if (!ok) { toast.error("We couldn't send your order. Please try again or order by chat."); return; }
    const message = buildOrderMessage(
      items,
      `Order ${number}\nName: ${name}\nPhone: ${g("phone")}\nArea: ${g("subCity")}\nPayment: ${paymentLabel}${promoCode ? `\nPromo code: ${promoCode} (-${formatPrice(discountAmount)})` : ""}\nAmount due: ${formatPrice(total)}`,
    );
    clearCart();
    if (paymentAccessToken) {
      window.location.assign(
        `/payment/${encodeURIComponent(number)}?token=${encodeURIComponent(paymentAccessToken)}`,
      );
      return;
    }
    setPlaced({ number, message });
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <p className="label-xs text-gold">Thank you</p>
        <h1 className="mt-5 text-5xl">Your order is placed.</h1>
        <p className="mt-4 label-xs text-gold">Order {placed.number}</p>
        <p className="mt-6 text-muted-foreground">We'll call you shortly to confirm delivery and payment. For a faster reply, send us your order on chat:</p>
        <div className="mt-6"><ChatOrderButtons message={placed.message} /></div>
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
          <input required name="first" placeholder="First name" className={field} />
          <input required name="last" placeholder="Last name" className={field} />
        </div>
        <input required name="phone" type="tel" placeholder="Phone (e.g. 0911 223344)" className={field} />
        <input name="email" type="email" placeholder="Email (optional)" className={field} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input required name="subCity" placeholder="Sub-city (e.g. Bole)" className={field} />
          <input required name="city" placeholder="City" className={field} defaultValue="Addis Ababa" />
        </div>
        <input required name="address" placeholder="Street, building or landmark" className={field} />
        <textarea name="notes" placeholder="Notes for delivery (optional)" className="min-h-24 w-full border border-border bg-transparent p-4 text-sm outline-none focus:border-primary" />
        <fieldset className="space-y-3 pt-2">
          <legend className="label-xs mb-3 text-gold">Payment</legend>
          {PAYMENT_METHODS.map((p) => (
            <label key={p.id} className={`flex cursor-pointer gap-3 border p-4 text-sm ${payment === p.id ? "border-primary" : "border-border"}`}>
              <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 accent-primary" />
              <span><span className="block font-medium">{p.label}</span><span className="text-muted-foreground">{p.note}</span>{p.account && payment === p.id && <CopyAccount value={p.account} />}</span>
            </label>
          ))}
        </fieldset>
        <AhabButton type="submit" size="lg" className="w-full" disabled={sending}>{sending ? "Sending…" : "Place order"}</AhabButton>
      </form>

      <aside className="h-fit bg-secondary p-8">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="mt-6 space-y-4">
          {lineItems.map(({ line, product }, i) => {
            const colorIdx = product.colors.findIndex(
              (c) => c.name.toLowerCase() === line.color.toLowerCase(),
            );
            const itemImage = product.images[colorIdx >= 0 ? colorIdx : 0] ?? product.images[0];
            return (
              <li key={i} className="flex gap-4">
                <img src={itemImage} alt={product.name} className="h-20 w-16 object-cover" />
                <div className="flex-1 text-sm">
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="font-serif text-base">{product.name}</Link>
                  <p className="text-muted-foreground">{line.color} · {line.size} · ×{line.qty}</p>
                </div>
                <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          {discountAmount > 0 ? (
            <div className="flex justify-between text-gold">
              <dt>Promo discount {promoCode}</dt>
              <dd>-{formatPrice(discountAmount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
          <div className="flex justify-between font-serif text-xl"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
