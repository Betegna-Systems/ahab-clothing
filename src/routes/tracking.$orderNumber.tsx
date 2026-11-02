import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { AhabLink } from "@/components/site/ui";
import { getTrackedOrder, submitVerifiedReview } from "@/lib/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/tracking/$orderNumber")({
  validateSearch: z.object({ token: z.string().uuid() }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: ({ params, deps }) =>
    getTrackedOrder({ data: { orderNumber: params.orderNumber, token: deps.token } }),
  head: () => ({
    meta: [
      { title: "Track Your Order | AHAB" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: OrderTrackingPage,
});

function trackingMessage(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized === "new") return "Your order has been received.";
  if (["confirmed", "processing", "preparing", "being prepared"].includes(normalized)) {
    return "Your order is being prepared.";
  }
  if (["shipped", "out for delivery", "in transit"].includes(normalized)) {
    return "Your order is on its way.";
  }
  if (normalized === "delivered") return "Your order has been delivered.";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "This order has been cancelled. Contact AHAB if you need assistance.";
  }
  return `Current status: ${status}`;
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
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const photo = form.get("photo");
    const file = photo instanceof File && photo.size > 0 ? photo : null;
    if (file && (file.size > 3 * 1024 * 1024 || !isReviewPhotoType(file.type))) {
      toast.error("Choose a JPG, PNG, or WebP photo smaller than 3 MB.");
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
          order_not_found: "We couldn't verify this order.",
          not_delivered: "Reviews can be submitted after delivery.",
          product_not_ordered: "This product isn't part of this order.",
          invalid_photo: "Choose a valid JPG, PNG, or WebP photo smaller than 3 MB.",
          photo_upload_failed: "We couldn't upload your photo. Please try again.",
          already_submitted: "A review has already been submitted for this product.",
          save_failed: "We couldn't save your review. Please try again.",
        };
        toast.error(messages[result.reason]);
        return;
      }

      toast.success("Review submitted for verification.");
      await router.invalidate();
    } catch {
      toast.error("We couldn't submit your review. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        Review received. It will appear after AHAB verifies and approves it.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <input
        name="reviewerName"
        required
        maxLength={80}
        placeholder="Name to show with your review"
        className="h-11 w-full border border-border bg-transparent px-3 text-sm"
      />
      <select
        name="rating"
        required
        defaultValue="5"
        aria-label={`Rating for ${product.name}`}
        className="h-11 w-full border border-border bg-transparent px-3 text-sm"
      >
        {[5, 4, 3, 2, 1].map((rating) => (
          <option key={rating} value={rating}>
            {rating} {rating === 1 ? "star" : "stars"}
          </option>
        ))}
      </select>
      <input
        name="fitFeedback"
        maxLength={500}
        placeholder="How did the fit feel? (optional)"
        className="h-11 w-full border border-border bg-transparent px-3 text-sm"
      />
      <textarea
        name="reviewText"
        required
        minLength={10}
        maxLength={1200}
        placeholder="Share your experience"
        className="min-h-24 w-full border border-border bg-transparent p-3 text-sm"
      />
      <input
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={`Optional customer photo for ${product.name}`}
        className="block w-full text-sm"
      />
      <button
        type="submit"
        disabled={sending}
        className="label-xs bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50"
      >
        {sending ? "Submitting…" : "Submit verified review"}
      </button>
    </form>
  );
}

function OrderTrackingPage() {
  const { orderNumber } = Route.useParams();
  const { token } = Route.useSearch();
  const order = Route.useLoaderData();
  const router = useRouter();

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="text-4xl">Tracking link unavailable.</h1>
        <p className="mt-4 text-muted-foreground">Check the order link or contact AHAB for help.</p>
        <AhabLink to="/shop" className="mt-8">
          Return to the shop
        </AhabLink>
      </div>
    );
  }

  const paymentConfirmed = order.paymentStatus === "confirmed";
  const paymentReceiptSubmitted = order.paymentStatus === "receipt_submitted";

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
      <div className="text-center">
        <p className="label-xs text-gold">Order {order.orderNumber}</p>
        <h1 className="mt-4 text-5xl">Order tracking</h1>
        <p className="mt-4 text-muted-foreground">Placed {order.createdAt.slice(0, 10)}</p>
      </div>

      <section className="mt-12 border border-border bg-secondary p-6 text-center md:p-10">
        <p className="label-xs text-gold">Current status</p>
        <h2 className="mt-3 font-serif text-3xl">{order.status}</h2>
        <p className="mt-3 text-muted-foreground">{trackingMessage(order.status)}</p>
        {paymentReceiptSubmitted || paymentConfirmed ? (
          <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
            {paymentConfirmed
              ? "Payment confirmed."
              : "Payment receipt received and awaiting verification."}
          </p>
        ) : null}
      </section>

      {order.status.trim().toLowerCase() === "delivered" && order.items.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-3xl">Share your experience</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Reviews are linked to delivered orders and published only after AHAB approval. Customer
            photos stay private until approved.
          </p>
          <div className="mt-6 space-y-8">
            {order.items.map((item, index) => (
              <article key={`${item.slug}-${index}`} className="border-t border-border pt-5">
                <h3 className="font-serif text-xl">{item.name}</h3>
                <ReviewForm
                  orderNumber={orderNumber}
                  token={token}
                  product={item}
                  submitted={order.reviewedProductSlugs.includes(item.slug)}
                />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="label-xs border border-border px-5 py-3 hover:border-primary"
        >
          Refresh status
        </button>
        <Link to="/shop" className="label-xs border border-border px-5 py-3 hover:border-primary">
          Continue shopping
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Need help? Share order {orderNumber} with AHAB through{" "}
        <Link to="/contact" className="underline underline-offset-4">
          customer care
        </Link>
        .
      </p>
    </div>
  );
}
