import { useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Check, Copy, Upload } from "lucide-react";
import { z } from "zod";
import { ChatOrderButtons } from "@/components/site/ChatOrderButtons";
import { AhabLink } from "@/components/site/ui";
import { getPaymentOrder, submitPaymentProof } from "@/lib/orders.functions";
import { PAYMENT_METHODS } from "@/lib/payment-methods";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/payment/$orderNumber")({
  validateSearch: z.object({ token: z.string().uuid() }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: ({ params, deps }) =>
    getPaymentOrder({ data: { orderNumber: params.orderNumber, token: deps.token } }),
  head: () => ({
    meta: [
      { title: "Complete Your Payment | AHAB" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: PaymentPage,
});

function readImageAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read this image."));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const separator = result.indexOf(",");
      if (separator < 0) reject(new Error("Unable to read this image."));
      else resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
}

function PaymentPage() {
  const { orderNumber } = Route.useParams();
  const { token } = Route.useSearch();
  const order = Route.useLoaderData();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="text-4xl">Payment link unavailable.</h1>
        <p className="mt-4 text-muted-foreground">Check the link from your order confirmation or contact AHAB for help.</p>
        <AhabLink to="/shop" className="mt-8">Return to the shop</AhabLink>
      </div>
    );
  }

  const payment = PAYMENT_METHODS.find((method) => method.label === order.paymentMethod);
  if (!payment?.account) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <h1 className="text-4xl">Payment details unavailable.</h1>
        <p className="mt-4 text-muted-foreground">Please contact AHAB with order {orderNumber}.</p>
      </div>
    );
  }

  const chatMessage = `Hello AHAB, I paid for order ${orderNumber} via ${payment.label}. Amount: ${formatPrice(order.total)}. I will attach my payment screenshot here.`;
  const receiptSubmitted = order.paymentStatus !== "pending";

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      toast.error("Choose a JPG, PNG, or WebP screenshot.");
      event.target.value = "";
      setFile(null);
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("The screenshot must be 5 MB or smaller.");
      event.target.value = "";
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const submitReceipt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error("Choose your payment screenshot first.");
      return;
    }
    setSending(true);
    try {
      const imageBase64 = await readImageAsBase64(file);
      const result = await submitPaymentProof({
        data: { orderNumber, token, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", imageBase64 },
      });
      if (!result.ok) {
        toast.error(result.reason === "already_submitted" ? "A screenshot has already been submitted for this order." : "We couldn't submit your screenshot. Please try again or send it by chat.");
        await router.invalidate();
        return;
      }
      setFile(null);
      toast.success("Payment screenshot received.");
      await router.invalidate();
    } catch {
      toast.error("We couldn't submit your screenshot. Please try again or send it by chat.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <div className="text-center">
        <p className="label-xs text-gold">Order {orderNumber}</p>
        <h1 className="mt-4 text-5xl">Complete your payment.</h1>
        <p className="mt-4 text-muted-foreground">Transfer the exact total, then upload a screenshot of your receipt.</p>
      </div>

      <section className="mt-12 border border-border bg-secondary p-6 md:p-10" aria-label="Payment instructions">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="label-xs text-gold">Pay with {payment.label}</p>
            <p className="mt-2 font-mono text-xl md:text-2xl">{payment.account}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(payment.account);
                toast.success("Payment details copied.");
              } catch {
                toast.error("Copy is unavailable in this browser.");
              }
            }}
            className="label-xs inline-flex h-10 items-center gap-2 border border-border px-4 hover:border-primary"
          >
            <Copy className="h-4 w-4" /> Copy details
          </button>
        </div>
        <div className="flex items-end justify-between gap-4 py-6">
          <span className="text-sm text-muted-foreground">Amount to transfer</span>
          <strong className="font-serif text-3xl">{formatPrice(order.total)}</strong>
        </div>
        <ol className="space-y-3 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
          <li>1. Send the amount above to the {payment.label} account.</li>
          <li>2. Keep your payment receipt screenshot. Make sure the amount and transaction reference are visible.</li>
          <li>3. Upload the screenshot below. AHAB will review it and confirm your order.</li>
        </ol>
      </section>

      {receiptSubmitted ? (
        <div className="mt-8 border border-gold/50 p-6 text-center">
          <Check className="mx-auto h-6 w-6 text-gold" strokeWidth={1.5} />
          <h2 className="mt-3 font-serif text-2xl">Screenshot received</h2>
          <p className="mt-2 text-sm text-muted-foreground">We’ll verify your payment and contact you to confirm delivery.</p>
        </div>
      ) : (
        <form onSubmit={submitReceipt} className="mt-8 space-y-4">
          <label className="label-xs block text-gold" htmlFor="payment-screenshot">Payment screenshot</label>
          <input
            id="payment-screenshot"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="block w-full border border-border bg-transparent p-4 text-sm file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider file:text-primary-foreground"
          />
          <p className="text-xs text-muted-foreground">JPG, PNG, or WebP. Maximum 5 MB. Your receipt is stored privately with this order.</p>
          {file ? <p className="text-sm">Selected: {file.name}</p> : null}
          <button type="submit" disabled={!file || sending} className="label-xs flex h-12 w-full items-center justify-center gap-2 bg-primary text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50">
            <Upload className="h-4 w-4" /> {sending ? "Sending screenshot…" : "Send payment screenshot"}
          </button>
        </form>
      )}

      <div className="mt-10 border-t border-border pt-8 text-center">
        <p className="mb-4 text-sm text-muted-foreground">Need help? You can also send the screenshot to AHAB in chat.</p>
        <ChatOrderButtons message={chatMessage} />
        <p className="mt-8"><Link to="/shop" className="label-xs text-muted-foreground underline underline-offset-4">Continue shopping</Link></p>
      </div>
    </div>
  );
}
