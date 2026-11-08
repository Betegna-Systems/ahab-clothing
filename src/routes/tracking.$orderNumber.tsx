import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { AhabLink } from "@/components/site/ui";
import { claimAccountOrder, getTrackedOrder, submitVerifiedReview } from "@/lib/orders.functions";
import { isPaymentConfirmed, isWellFormedOrderLink } from "@/lib/order-access";
import { initializeSupabaseBrowser, supabase } from "@/integrations/supabase/client";
import { getProductCached } from "@/lib/firestore-products";
import { formatDate, headT, useLocale, useT, type Translator } from "@/lib/i18n";
import { productText } from "@/lib/i18n/product";
import { toast } from "sonner";

export const Route = createFileRoute("/tracking/$orderNumber")({
  // A missing or mangled link shows "unavailable" rather than a server error.
  validateSearch: z.object({ token: z.string().catch("") }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: ({ params, deps }) =>
    isWellFormedOrderLink(params.orderNumber, deps.token)
      ? getTrackedOrder({ data: { orderNumber: params.orderNumber, token: deps.token } })
      : null,
  head: ({ match }) => {
    const { t } = headT(match.context);
    return {
      meta: [
        { title: t("Track Your Order | AHAB") },
        { name: "robots", content: "noindex,nofollow" },
        { name: "referrer", content: "no-referrer" },
      ],
    };
  },
  component: OrderTrackingPage,
});

// Order statuses are stored in English by the admin app; compare on English, display translated.
function trackingMessage(status: string, t: Translator) {
  const normalized = status.trim().toLowerCase();
  if (normalized === "new") return t("Your order has been received.");
  if (["confirmed", "processing", "preparing", "being prepared"].includes(normalized)) {
    return t("Your order is being prepared.");
  }
  if (["shipped", "out for delivery", "in transit"].includes(normalized)) {
    return t("Your order is on its way.");
  }
  if (normalized === "delivered") return t("Your order has been delivered.");
  if (normalized === "cancelled" || normalized === "canceled") {
    return t("This order has been cancelled. Contact AHAB if you need assistance.");
  }
  return t("Current status: {status}", { status: statusLabel(status, t) });
}

/** The stored status in the page language; unknown statuses are shown as stored. */
function statusLabel(status: string, t: Translator) {
  switch (status.trim().toLowerCase()) {
    case "new":
      return t("New");
    case "confirmed":
      return t("Confirmed");
    case "processing":
      return t("Processing");
    case "preparing":
    case "being prepared":
      return t("Being prepared");
    case "packed":
      return t("Packed");
    case "shipped":
      return t("Shipped");
    case "out for delivery":
      return t("Out for delivery");
    case "in transit":
      return t("In transit");
    case "delivered":
      return t("Delivered");
    case "cancelled":
    case "canceled":
      return t("Cancelled");
    default:
      return status;
  }
}

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function isReviewPhotoType(type: string): type is "image/jpeg" | "image/png" | "image/webp" {
  return type === "image/jpeg" || type === "image/png" || type === "image/webp";
}

function ReviewForm({
  orderNumber,
  token,
  product,
  submitted,
}: {
  orderNumber: string;
  token: string;
  product: { slug: string; name: string };
  submitted: boolean;
}) {
  const router = useRouter();
  const t = useT();
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const photo = form.get("photo");
    const file = photo instanceof File && photo.size > 0 ? photo : null;
    if (file && (file.size > 3 * 1024 * 1024 || !isReviewPhotoType(file.type))) {
      toast.error(t("Choose a JPG, PNG, or WebP photo smaller than 3 MB."));
      return;
    }

    setSending(true);
    try {
      const result = await submitVerifiedReview({
        data: {
          orderNumber,
          token,
          productSlug: product.slug,
          reviewerName: String(form.get("reviewerName") ?? "").trim(),
          rating: Number(form.get("rating")),
          fitFeedback: String(form.get("fitFeedback") ?? "").trim(),
          reviewText: String(form.get("reviewText") ?? "").trim(),
          ...(file
            ? {
                photoMimeType: file.type,
                photoBase64: await fileToBase64(file),
              }
            : {}),
        },
      });

      if (!result.ok) {
        const messages = {
          order_not_found: t("We couldn't verify this order."),
          not_delivered: t("Reviews can be submitted after delivery."),
          product_not_ordered: t("This product isn't part of this order."),
          invalid_photo: t("Choose a valid JPG, PNG, or WebP photo smaller than 3 MB."),
          photo_upload_failed: t("We couldn't upload your photo. Please try again."),
          already_submitted: t("A review has already been submitted for this product."),
          save_failed: t("We couldn't save your review. Please try again."),
        };
        toast.error(messages[result.reason]);
        return;
      }

      toast.success(t("Review submitted for verification."));
      await router.invalidate();
    } catch {
      toast.error(t("We couldn't submit your review. Please try again."));
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        {t("Review received. It will appear after AHAB verifies and approves it.")}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <input
        name="reviewerName"
        required
        maxLength={80}
        placeholder={t("Name to show with your review")}
        className="h-11 w-full border border-border bg-transparent px-3 text-sm"
      />
      <select
        name="rating"
        required
        defaultValue="5"
        aria-label={t("Rating for {name}", { name: product.name })}
        className="h-11 w-full border border-border bg-transparent px-3 text-sm"
      >
        {[5, 4, 3, 2, 1].map((rating) => (
          <option key={rating} value={rating}>
            {rating === 1 ? t("1 star") : t("{count} stars", { count: rating })}
          </option>
        ))}
      </select>
      <input
        name="fitFeedback"
        maxLength={500}
        placeholder={t("How did the fit feel? (optional)")}
        className="h-11 w-full border border-border bg-transparent px-3 text-sm"
      />
      <textarea
        name="reviewText"
        required
        minLength={10}
        maxLength={1200}
        placeholder={t("Share your experience")}
        className="min-h-24 w-full border border-border bg-transparent p-3 text-sm"
      />
      <input
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={t("Optional customer photo for {name}", { name: product.name })}
        className="block w-full text-sm"
      />
      <button
        type="submit"
        disabled={sending}
        className="label-xs bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50"
      >
        {sending ? t("Submitting…") : t("Submit verified review")}
      </button>
    </form>
  );
}

function SaveToAccount({ orderNumber, token }: { orderNumber: string; token: string }) {
  const t = useT();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    let active = true;
    void initializeSupabaseBrowser()
      .then(async (configured) => {
        if (!configured) return;
        const { data } = await supabase.auth.getSession();
        if (active) setAccessToken(data.session?.access_token ?? null);
      })
      .catch(() => console.error("Tracking account session check failed."));
    return () => {
      active = false;
    };
  }, []);

  if (!accessToken) return null;

  const save = async () => {
    setState("saving");
    try {
      const result = await claimAccountOrder({ data: { orderNumber, token, accessToken } });
      if (result.ok) {
        setState("saved");
        toast.success(t("Order saved to your account."));
        return;
      }
      setState("idle");
      toast.error(
        result.reason === "mfa_required"
          ? t("Complete two-step verification in your account first.")
          : result.reason === "email_not_verified"
            ? t("Verify your account email first.")
            : result.reason === "claimed_by_other"
              ? t("This order is already linked to another account.")
              : t("We couldn't save this order to your account."),
      );
    } catch (error) {
      console.error("Order claim failed:", error);
      setState("idle");
      toast.error(t("We couldn't save this order to your account."));
    }
  };

  return state === "saved" ? (
    <Link to="/account" className="label-xs border border-border px-5 py-3 hover:border-primary">
      {t("View in account")}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => void save()}
      disabled={state === "saving"}
      className="label-xs border border-border px-5 py-3 hover:border-primary"
    >
      {state === "saving" ? t("Saving…") : t("Save to my account")}
    </button>
  );
}

function OrderTrackingPage() {
  const { orderNumber } = Route.useParams();
  const { token } = Route.useSearch();
  const loadedOrder = Route.useLoaderData();
  const [order, setOrder] = useState(loadedOrder);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const t = useT();
  const locale = useLocale();

  useEffect(() => {
    setOrder(loadedOrder);
  }, [loadedOrder]);

  const refreshStatus = async () => {
    setRefreshing(true);
    try {
      const latestOrder = await getTrackedOrder({ data: { orderNumber, token } });
      if (!latestOrder) {
        setOrder(null);
        toast.error(t("This tracking link is no longer available."));
        return;
      }
      setOrder(latestOrder);
      toast.success(t("Order status updated."));
    } catch (error) {
      console.error("Order status refresh failed:", error);
      toast.error(t("We couldn't refresh your order status. Please try again."));
    } finally {
      setRefreshing(false);
    }
  };

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="text-4xl">{t("Tracking link unavailable.")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t("Check the order link or contact AHAB for help.")}
        </p>
        <AhabLink to="/shop" className="mt-8">
          {t("Return to the shop")}
        </AhabLink>
      </div>
    );
  }

  const paymentConfirmed = isPaymentConfirmed(order.paymentStatus);
  const paymentReceiptSubmitted = order.paymentStatus === "receipt_submitted";

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
      <div className="text-center">
        <p className="label-xs text-gold">{t("Order {number}", { number: order.orderNumber })}</p>
        <h1 className="mt-4 text-5xl">{t("Order tracking")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t("Placed {date}", { date: formatDate(order.createdAt, locale) })}
        </p>
      </div>

      <section className="mt-12 border border-border bg-secondary p-6 text-center md:p-10">
        <p className="label-xs text-gold">{t("Current status")}</p>
        <h2 className="mt-3 font-serif text-3xl">{statusLabel(order.status, t)}</h2>
        <p className="mt-3 text-muted-foreground">{trackingMessage(order.status, t)}</p>
        {paymentReceiptSubmitted || paymentConfirmed ? (
          <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
            {paymentConfirmed
              ? t("Payment confirmed.")
              : t("Payment receipt received and awaiting verification.")}
          </p>
        ) : null}
      </section>

      {order.status.trim().toLowerCase() === "delivered" && order.items.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-3xl">{t("Share your experience")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t(
              "Reviews are linked to delivered orders and published only after AHAB approval. Customer photos stay private until approved.",
            )}
          </p>
          <div className="mt-6 space-y-8">
            {order.items.map((item, index) => {
              // Show the catalog's Amharic name when there is one; the order keeps English.
              const catalogProduct = getProductCached(item.slug);
              const name = catalogProduct ? productText(catalogProduct, locale).name : item.name;
              return (
                <article key={`${item.slug}-${index}`} className="border-t border-border pt-5">
                  <h3 className="font-serif text-xl">{name}</h3>
                  <ReviewForm
                    orderNumber={orderNumber}
                    token={token}
                    product={{ slug: item.slug, name }}
                    submitted={order.reviewedProductSlugs.includes(item.slug)}
                  />
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => void refreshStatus()}
          disabled={refreshing}
          className="label-xs border border-border px-5 py-3 hover:border-primary"
        >
          {refreshing ? t("Refreshing…") : t("Refresh status")}
        </button>
        <SaveToAccount orderNumber={orderNumber} token={token} />
        <Link to="/shop" className="label-xs border border-border px-5 py-3 hover:border-primary">
          {t("Continue shopping")}
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("Need help? Share order {number} with AHAB.", { number: orderNumber })}{" "}
        <Link to="/contact" className="underline underline-offset-4">
          {t("Contact customer care")}
        </Link>
      </p>
    </div>
  );
}
