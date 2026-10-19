import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { seo } from "@/lib/seo";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { ChatOrderButtons } from "@/components/site/ChatOrderButtons";
import { buildOrderMessage, submitOrder, type OrderLine } from "@/lib/order-channels";
import { toast } from "sonner";

const PAYMENTS = [
  { id: "cod", label: "Cash on delivery", note: "Pay when your top arrives in Addis Ababa." },
  { id: "telebirr", label: "Telebirr", note: "We send payment details when we confirm your order." },
  { id: "cbe", label: "CBE bank transfer", note: "Account details are shared on confirmation." },
];

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Complete your AHAB order — delivery details and order summary."),
  component: CheckoutPage,
});

const field = "h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-primary";

function CheckoutPage() {
  const { lineItems, subtotal, clearCart } = useShop();
  const [placed, setPlaced] = useState<{ number: string; message: string } | null>(null);
  const [payment, setPayment] = useState("cod");
  const [sending, setSending] = useState(false);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const items: OrderLine[] = lineItems.map(({ line, product }) => ({ name: product.name, color: line.color, size: line.size, qty: line.qty, price: product.price }));
    const number = `AHAB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const name = `${g("first")} ${g("last")}`;
    const paymentLabel = PAYMENTS.find((p) => p.id === payment)!.label;
    setSending(true);
    const ok = await submitOrder({
      orderNumber: number,
      createdAt: new Date().toISOString(),
      customer: { name, email: g("email"), phone: g("phone"), address: g("address"), subCity: g("subCity"), city: g("city") },
      items, subtotal, shipping, total: subtotal + shipping, paymentMethod: paymentLabel, notes: g("notes"),
    });
    setSending(false);
    if (!ok) { toast.error("We couldn't send your order. Please try again or order by chat."); return; }
    const message = buildOrderMessage(items, `Order ${number}\nName: ${name}\nPhone: ${g("phone")}\nArea: ${g("subCity")}\nPayment: ${paymentLabel}`);
    clearCart();
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
          {PAYMENTS.map((p) => (
            <label key={p.id} className={`flex cursor-pointer gap-3 border p-4 text-sm ${payment === p.id ? "border-primary" : "border-border"}`}>
              <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 accent-primary" />
              <span><span className="block font-medium">{p.label}</span><span className="text-muted-foreground">{p.note}</span></span>
            </label>
          ))}
        </fieldset>
        <AhabButton type="submit" size="lg" className="w-full" disabled={sending}>{sending ? "Sending…" : "Place order"}</AhabButton>
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
