import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { seo } from "@/lib/seo";
import { formatPrice } from "@/lib/products";
import { orderTotals } from "@/lib/order-pricing";
import { generateOrderNumber } from "@/lib/order-access";
import { useShop } from "@/lib/shop-store";
import { AhabButton, AhabLink } from "@/components/site/ui";
import { ChatOrderButtons } from "@/components/site/ChatOrderButtons";
import { buildOrderMessage, type OrderPayload } from "@/lib/order-channels";
import { placeOrder } from "@/lib/orders.functions";
import { PAYMENT_METHODS, getPaymentMethod } from "@/lib/payment-methods";
import { initializeSupabaseBrowser } from "@/integrations/supabase/client";
import { featureClient as supabase } from "@/lib/feature-client";
import type { FeatureDatabase as Database } from "@/lib/feature-database";
import { toast } from "sonner";
import { headT, localizePath, useLocale, useT } from "@/lib/i18n";
import { useProductText } from "@/lib/i18n/product";

type SavedAddress = Database["public"]["Tables"]["account_saved_addresses"]["Row"];

function CopyAccount({ value }: { value: string }) {
  const t = useT();
  return (
    <span className="mt-2 flex items-center gap-3">
      <span className="font-mono text-base text-foreground">{value}</span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(value).then(
            () => toast.success(t("Copied")),
            () => toast.error(t("Copy is unavailable in this browser.")),
          );
        }}
        className="label-xs border border-border px-2 py-1 hover:border-primary"
      >
        {t("Copy")}
      </button>
    </span>
  );
}

export const Route = createFileRoute("/checkout")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(t("Checkout"), t("Complete your AHAB order — delivery details and order summary."), {
      path: "/checkout",
      index: false,
      locale,
    });
  },
  component: CheckoutPage,
});

const field =
  "h-12 w-full border border-border bg-transparent px-4 text-sm outline-none focus:border-primary";

function CheckoutPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const t = useT();
  const locale = useLocale();
  const text = useProductText();
  const {
    lineItems,
    subtotal,
    promo,
    clearPromo,
    clearCart,
    inventoryStatus,
    isVariantAvailable,
    hasUnavailableCartLines,
    refreshInventory,
  } = useShop();
  const [placed, setPlaced] = useState<{
    number: string;
    message: string;
    token: string;
  } | null>(null);
  const [payment, setPayment] = useState("cod");
  const [sending, setSending] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  // promoCode is set only when the bag's code applies (it may be below its minimum order).
  const { discount: discountAmount, shipping, total, promoCode } = orderTotals(subtotal, promo);

  const setInputValue = useCallback((name: string, value: string) => {
    const input = formRef.current?.elements.namedItem(name);
    if (input instanceof HTMLInputElement) input.value = value;
  }, []);

  useEffect(() => {
    let active = true;
    const loadSavedAddresses = async () => {
      const configured = await initializeSupabaseBrowser();
      if (!configured) return;

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Checkout account lookup failed:", sessionError.message);
        return;
      }
      const session = sessionData.session;
      if (!session) return;

      const { data, error } = await supabase
        .from("account_saved_addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Checkout saved address lookup failed:", error.message);
        toast.error(t("Saved delivery addresses couldn't be loaded."));
        return;
      }
      if (!active) return;
      setSavedAddresses(data ?? []);

      const profileName = String(session.user.user_metadata["full_name"] ?? "").trim();
      const [first, ...lastParts] = profileName.split(/\s+/);
      setInputValue("first", first ?? "");
      setInputValue("last", lastParts.join(" "));
      setInputValue("email", session.user.email ?? "");
    };

    void loadSavedAddresses().catch((error: unknown) => {
      console.error("Checkout account initialization failed:", error);
    });
    return () => {
      active = false;
    };
  }, [setInputValue, t]);

  const applySavedAddress = (id: string) => {
    setSelectedAddressId(id);
    const address = savedAddresses.find((saved) => saved.id === id);
    if (!address) return;
    const [first, ...lastParts] = address.recipient_name.trim().split(/\s+/);
    setInputValue("first", first ?? "");
    setInputValue("last", lastParts.join(" "));
    setInputValue("phone", address.phone);
    setInputValue("subCity", address.sub_city);
    setInputValue("city", address.city);
    setInputValue("address", address.address);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inventoryStatus !== "ready" || hasUnavailableCartLines) {
      if (inventoryStatus === "error") void refreshInventory();
      toast.error(t("Some items are unavailable. Update your bag before placing the order."));
      return;
    }

    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const items: OrderPayload["items"] = lineItems.map(({ line, product }) => {
      const colorIdx = product.colors.findIndex(
        (c) => c.name.toLowerCase() === line.color.toLowerCase(),
      );
      return {
        slug: product.slug,
        name: product.name,
        color: line.color,
        size: line.size,
        qty: line.qty,
        price: product.price,
        image: product.images[colorIdx >= 0 ? colorIdx : 0] ?? product.images[0] ?? "",
      };
    });
    const number = generateOrderNumber((bytes) => crypto.getRandomValues(bytes));
    const name = `${g("first")} ${g("last")}`;
    const selectedPayment = getPaymentMethod(payment)!;
    const paymentLabel = selectedPayment.label;
    const paymentAccessToken = crypto.randomUUID();
    setSending(true);
    let result: Awaited<ReturnType<typeof placeOrder>> | undefined;
    try {
      const accountAccessToken = (await initializeSupabaseBrowser())
        ? (await supabase.auth.getSession()).data.session?.access_token
        : undefined;
      const order: OrderPayload = {
        ...(accountAccessToken ? { accountAccessToken } : {}),
        orderNumber: number,
        createdAt: new Date().toISOString(),
        customer: {
          name,
          email: g("email").toLowerCase(),
          phone: g("phone"),
          address: g("address"),
          subCity: g("subCity"),
          city: g("city"),
        },
        items,
        subtotal,
        shipping,
        total,
        promoCode,
        paymentMethod: paymentLabel,
        paymentAccessToken,
        notes: g("notes"),
      };
      // The English payment label is the stored value; `locale` picks the email language.
      result = await placeOrder({ data: { ...order, locale } });
    } catch (error) {
      console.error("Checkout order submission failed:", error);
      toast.error(t("We couldn't send your order. Please try again."));
      return;
    } finally {
      setSending(false);
    }

    if (!result.ok) {
      toast.error(
        result.reason === "unavailable"
          ? t("One or more selected size and color combinations are not available.")
          : result.reason === "insufficient_stock"
            ? t(
                "There isn't enough stock for the requested quantity. Update your bag and try again.",
              )
            : result.reason === "promo_unavailable"
              ? t(
                  "Your promo code is no longer available, so it has been removed. Review your new total and place the order again.",
                )
              : result.reason === "price_changed"
                ? t("Prices or delivery charges have changed. Review your bag and try again.")
                : result.reason === "rate_limited"
                  ? t(
                      "Several orders were just placed with this phone number. Please contact AHAB on chat to place another.",
                    )
                  : t("We couldn't send your order. Please try again."),
      );
      if (result.reason === "promo_unavailable") clearPromo();
      await refreshInventory();
      return;
    }
    void refreshInventory();
    // The chat message is read by AHAB staff, so it stays in English.
    const message = buildOrderMessage(
      items,
      `Order ${number}\nName: ${name}\nPhone: ${g("phone")}\nArea: ${g("subCity")}\nPayment: ${paymentLabel}${promoCode ? `\nPromo code: ${promoCode} (-${formatPrice(discountAmount)})` : ""}\nAmount due: ${formatPrice(total)}`,
    );
    clearCart();
    if (payment !== "cod") {
      // Localized path so Amharic shoppers stay in Amharic on the payment page.
      window.location.assign(
        `${localizePath(`/payment/${encodeURIComponent(number)}`, locale)}?token=${encodeURIComponent(paymentAccessToken)}`,
      );
      return;
    }
    setPlaced({ number, message, token: paymentAccessToken });
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <p className="label-xs text-gold">{t("Thank you")}</p>
        <h1 className="mt-5 text-5xl">{t("Your order is placed.")}</h1>
        <p className="mt-4 label-xs text-gold">{t("Order {number}", { number: placed.number })}</p>
        <p className="mt-6 text-muted-foreground">
          {t(
            "We'll call you shortly to confirm delivery and payment. For a faster reply, send us your order on chat:",
          )}
        </p>
        <p className="mt-6">
          <Link
            to="/tracking/$orderNumber"
            params={{ orderNumber: placed.number }}
            search={{ token: placed.token }}
            className="label-xs link-underline"
          >
            {t("Track this order")}
          </Link>
        </p>
        <div className="mt-6">
          <ChatOrderButtons message={placed.message} />
        </div>
        <div className="mt-10">
          <AhabLink to="/shop">{t("Continue shopping")}</AhabLink>
        </div>
      </div>
    );
  }

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="text-5xl">{t("Your bag is empty.")}</h1>
        <div className="mt-10">
          <AhabLink to="/shop">{t("Discover the collection")}</AhabLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1200px] gap-16 px-5 py-20 md:px-10 lg:grid-cols-[1fr_400px]">
      <form ref={formRef} onSubmit={submit} className="space-y-5">
        <p className="label-xs text-gold">{t("Checkout")}</p>
        <h1 className="text-5xl">{t("Delivery details")}</h1>
        {savedAddresses.length > 0 ? (
          <label className="block space-y-2 text-sm">
            <span className="label-xs text-gold">{t("Use a saved address")}</span>
            <select
              value={selectedAddressId}
              onChange={(event) => applySavedAddress(event.currentTarget.value)}
              className={field}
            >
              <option value="">{t("Enter a new delivery address")}</option>
              {savedAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label} — {address.sub_city}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <input required name="first" placeholder={t("First name")} className={field} />
          <input required name="last" placeholder={t("Last name")} className={field} />
        </div>
        <input
          required
          name="phone"
          type="tel"
          placeholder={t("Phone (e.g. 0911 223344)")}
          className={field}
        />
        <input name="email" type="email" placeholder={t("Email (optional)")} className={field} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            name="subCity"
            placeholder={t("Sub-city (e.g. Bole)")}
            className={field}
          />
          <input
            required
            name="city"
            placeholder={t("City")}
            className={field}
            defaultValue="Addis Ababa"
          />
        </div>
        <input
          required
          name="address"
          placeholder={t("Street, building or landmark")}
          className={field}
        />
        <textarea
          name="notes"
          placeholder={t("Notes for delivery (optional)")}
          className="min-h-24 w-full border border-border bg-transparent p-4 text-sm outline-none focus:border-primary"
        />
        <fieldset className="space-y-3 pt-2">
          <legend className="label-xs mb-3 text-gold">{t("Payment")}</legend>
          {PAYMENT_METHODS.map((p) => (
            <label
              key={p.id}
              className={`flex cursor-pointer gap-3 border p-4 text-sm ${payment === p.id ? "border-primary" : "border-border"}`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === p.id}
                onChange={() => setPayment(p.id)}
                className="mt-1 accent-primary"
              />
              <span>
                <span className="block font-medium">{t(p.label)}</span>
                <span className="text-muted-foreground">{t(p.note)}</span>
                {p.account && payment === p.id && <CopyAccount value={p.account} />}
              </span>
            </label>
          ))}
        </fieldset>
        {inventoryStatus === "error" ? (
          <div className="border border-destructive/40 p-4 text-sm text-destructive">
            {t("Stock availability couldn't be verified.")}{" "}
            <button type="button" className="underline" onClick={() => void refreshInventory()}>
              {t("Try again")}
            </button>
          </div>
        ) : null}
        {inventoryStatus === "loading" ? (
          <p className="text-sm text-muted-foreground">{t("Checking stock for your order…")}</p>
        ) : null}
        {inventoryStatus === "ready" && hasUnavailableCartLines ? (
          <p className="text-sm text-destructive">
            {t(
              "One or more items are unavailable in the selected size or color. Remove them from your bag before continuing.",
            )}
          </p>
        ) : null}
        <AhabButton
          type="submit"
          size="lg"
          className="w-full"
          disabled={
            sending ||
            inventoryStatus !== "ready" ||
            hasUnavailableCartLines ||
            lineItems.some(({ line }) => !isVariantAvailable(line.slug, line.color, line.size))
          }
        >
          {sending ? t("Sending…") : t("Place order")}
        </AhabButton>
      </form>

      <aside className="h-fit bg-secondary p-8">
        <h2 className="font-serif text-2xl">{t("Order summary")}</h2>
        <ul className="mt-6 space-y-4">
          {lineItems.map(({ line, product }, i) => {
            const colorIdx = product.colors.findIndex(
              (c) => c.name.toLowerCase() === line.color.toLowerCase(),
            );
            const itemImage = product.images[colorIdx >= 0 ? colorIdx : 0] ?? product.images[0];
            return (
              <li key={i} className="flex gap-4">
                <img src={itemImage} alt={text(product).name} className="h-20 w-16 object-cover" />
                <div className="flex-1 text-sm">
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="font-serif text-base"
                  >
                    {text(product).name}
                  </Link>
                  <p className="text-muted-foreground">
                    {text(product).color(line.color)} · {line.size} · ×{line.qty}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
          <div className="flex justify-between">
            <dt>{t("Subtotal")}</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {discountAmount > 0 ? (
            <div className="flex justify-between text-gold">
              <dt>{t("Promo discount {code}", { code: promoCode ?? "" })}</dt>
              <dd>-{formatPrice(discountAmount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt>{t("Delivery")}</dt>
            <dd>{shipping ? formatPrice(shipping) : t("Free")}</dd>
          </div>
          <div className="flex justify-between font-serif text-xl">
            <dt>{t("Total")}</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
