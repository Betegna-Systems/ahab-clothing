import { ChatOrderButtons } from "@/components/site/ChatOrderButtons";
import { buildOrderMessage } from "@/lib/order-channels";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products";
import { MAX_CART_QUANTITY } from "@/lib/order-limits";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { AhabLink } from "./ui";
import { useT } from "@/lib/i18n";
import { useProductText } from "@/lib/i18n/product";

const FREE_SHIPPING = 5000;

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    lineItems,
    removeLine,
    setQty,
    subtotal,
    promoCode,
    discount,
    applyPromoCode,
    inventoryStatus,
    isVariantAvailable,
    hasUnavailableCartLines,
    refreshInventory,
  } = useShop();
  const [promo, setPromo] = useState("");
  const t = useT();
  const text = useProductText();

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : 250;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount + shipping;

  const applyPromo = () => {
    const rate = applyPromoCode(promo);
    if (rate !== null) {
      toast.success(t("Promo applied"), {
        description: t("{percent}% off your order.", { percent: Math.round(rate * 100) }),
      });
    } else {
      toast.error(t("Invalid promo code"));
    }
  };

  const orderLines = lineItems.map(({ line, product }) => ({
    slug: product.slug,
    name: product.name,
    color: line.color,
    size: line.size,
    qty: line.qty,
    price: product.price,
  }));
  const chatMessage = buildOrderMessage(
    orderLines,
    [
      promoCode ? `Promo code ${promoCode}: -${formatPrice(discountAmount)}` : "",
      `Shipping: ${shipping ? formatPrice(shipping) : "Free"}`,
      `Amount due: ${formatPrice(total)}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

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
          <h2 className="font-serif text-2xl">{t("Your bag")}</h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label={t("Close cart")}>
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {lineItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-2xl">{t("Your bag is empty.")}</p>
            <p className="text-sm text-muted-foreground">
              {t("Begin with the pieces our customers return for.")}
            </p>
            <AhabLink to="/shop" onClick={() => setCartOpen(false)}>
              {t("Shop the collection")}
            </AhabLink>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {subtotal < FREE_SHIPPING ? (
                <p className="border-b border-border py-4 text-xs text-muted-foreground">
                  {t("Add {amount} for free Addis Ababa delivery.", {
                    amount: formatPrice(FREE_SHIPPING - subtotal),
                  })}
                </p>
              ) : null}
              <ul className="divide-y divide-border">
                {lineItems.map(({ line, product }, i) => {
                  const colorIdx = product.colors.findIndex(
                    (c) => c.name.toLowerCase() === line.color.toLowerCase(),
                  );
                  const itemImage =
                    product.images[colorIdx >= 0 ? colorIdx : 0] ?? product.images[0];
                  return (
                    <li key={`${line.slug}-${line.size}-${line.color}`} className="flex gap-4 py-5">
                      <img
                        src={itemImage}
                        alt={text(product).name}
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
                            {text(product).name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeLine(i)}
                            aria-label={t("Remove item")}
                          >
                            <X className="h-4 w-4 text-muted-foreground" strokeWidth={1.25} />
                          </button>
                        </div>
                        <p className="label-xs mt-1 text-muted-foreground">
                          {text(product).color(line.color)} · {line.size}
                        </p>
                        {inventoryStatus === "ready" &&
                        !isVariantAvailable(line.slug, line.color, line.size) ? (
                          <p className="mt-2 text-xs text-destructive">
                            {t("This size and color are unavailable. Remove it to continue.")}
                          </p>
                        ) : null}
                        <p className="label-xs mt-2 text-foreground">
                          {formatPrice(product.price)}
                        </p>
                        <div className="mt-auto flex items-center gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setQty(i, line.qty - 1)}
                            disabled={line.qty <= 1}
                            aria-label={t("Decrease quantity")}
                            className="grid h-8 w-8 place-items-center border border-border disabled:opacity-40"
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(i, line.qty + 1)}
                            aria-label={t("Increase quantity")}
                            disabled={line.qty >= MAX_CART_QUANTITY}
                            className="grid h-8 w-8 place-items-center border border-border disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-border bg-cream p-6">
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder={t("Promo code (AHAB10)")}
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="h-10 flex-1 border border-border bg-transparent px-3 text-xs tracking-wider uppercase outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="label-xs border border-primary px-4 hover:bg-primary hover:text-primary-foreground"
                >
                  {t("Apply")}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t("Subtotal")}</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-gold">
                    <span>{t("Promo discount {code}", { code: promoCode ?? "" })}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>{t("Delivery")}</span>
                  <span>{shipping === 0 ? t("Free") : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-serif text-foreground">
                  <span>{t("Total")}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-2.5">
                <Link
                  to="/checkout"
                  onClick={(event) => {
                    if (hasUnavailableCartLines) {
                      event.preventDefault();
                      if (inventoryStatus === "error") void refreshInventory();
                      toast.error(t("Check stock for every item before continuing to checkout."));
                      return;
                    }
                    setCartOpen(false);
                  }}
                  aria-disabled={hasUnavailableCartLines}
                  className={cn(
                    "label-xs grid h-13 w-full place-items-center bg-primary text-primary-foreground",
                    hasUnavailableCartLines && "cursor-not-allowed opacity-50",
                  )}
                >
                  {t("Proceed to Checkout")}
                </Link>
                <ChatOrderButtons
                  message={chatMessage}
                  onBeforeOpen={() => {
                    if (hasUnavailableCartLines) {
                      toast.error(t("Some selected size and color combinations are unavailable."));
                      return false;
                    }
                    return true;
                  }}
                />
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
