import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseAdminApp } from "@/lib/firebase-admin.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type OrderAlert = {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
};

type CustomCommissionAlert = {
  commissionId: string;
  commissionType: "top" | "suit";
  customerName: string;
  customerPhone: string;
};

async function sendTelegramAlert(message: string) {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];

  if (!botToken || !chatId) {
    console.warn(
      "Telegram alert skipped: configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the server environment.",
    );
    return;
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Telegram API returned HTTP ${response.status}.`);
  }

  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
    throw new Error("Telegram API rejected the alert.");
  }
}

async function safelySendTelegramAlert(message: string, context: string) {
  try {
    await sendTelegramAlert(message);
  } catch (error) {
    const botToken = process.env["TELEGRAM_BOT_TOKEN"];
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `${context} Telegram alert failed:`,
      botToken ? errorMessage.replaceAll(botToken, "[redacted]") : errorMessage,
    );
  }
}

export async function notifyAdminsOfNewOrder(order: OrderAlert) {
  await safelySendTelegramAlert(
    [
      "New AHAB order",
      `Order: ${order.orderNumber}`,
      `Total: ETB ${order.total.toLocaleString()}`,
      `Payment: ${order.paymentMethod}`,
      `Customer: ${order.customerName}`,
      `Phone: ${order.customerPhone}`,
    ].join("\n"),
    "New order",
  );

  await sendAdminPushNotification(
    "New AHAB order",
    `${order.orderNumber} - ETB ${order.total.toLocaleString()}`,
    { type: "new_order", orderNumber: order.orderNumber },
    "New order",
  );
}

export async function notifyAdminsOfNewCustomCommission(commission: CustomCommissionAlert) {
  await safelySendTelegramAlert(
    [
      `New AHAB custom ${commission.commissionType} request`,
      `Request: ${commission.commissionId}`,
      `Customer: ${commission.customerName}`,
      `Phone: ${commission.customerPhone}`,
      "Open /admin/custom-orders to review.",
    ].join("\n"),
    "Custom commission",
  );

  await sendAdminPushNotification(
    "New custom commission",
    `${commission.customerName} - custom ${commission.commissionType}`,
    { type: "new_custom_commission", commissionId: commission.commissionId },
    "Custom commission",
  );
}

export async function notifyAdminsOfNewReview(review: {
  orderNumber: string;
  productSlug: string;
  reviewerName: string;
  rating: number;
}) {
  await safelySendTelegramAlert(
    [
      "New AHAB review waiting for approval",
      `Product: ${review.productSlug}`,
      `Rating: ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`,
      `By: ${review.reviewerName} (order ${review.orderNumber})`,
      "Approve it in the admin app → Reviews.",
    ].join("\n"),
    "New review",
  );

  await sendAdminPushNotification(
    "New review to approve",
    `${review.reviewerName} · ${review.rating}/5 · ${review.productSlug}`,
    { type: "new_review", orderNumber: review.orderNumber },
    "New review",
  );
}

export async function notifyAdminsOfPaymentReceiptSubmission(order: OrderAlert) {
  await safelySendTelegramAlert(
    [
      "AHAB payment receipt submitted",
      `Order: ${order.orderNumber}`,
      `Total: ETB ${order.total.toLocaleString()}`,
      `Payment: ${order.paymentMethod}`,
      `Customer: ${order.customerName}`,
      `Phone: ${order.customerPhone}`,
    ].join("\n"),
    "Payment receipt",
  );
}

async function sendAdminPushNotification(
  title: string,
  body: string,
  data: Record<string, string>,
  context: string,
) {
  try {
    const { data: devices, error } = await supabaseAdmin.from("admin_push_tokens").select("token");
    if (error) throw error;
    if (!devices?.length) return;

    const messaging = getMessaging(getFirebaseAdminApp());
    const tokens = devices.map(({ token }) => token);
    for (let offset = 0; offset < tokens.length; offset += 500) {
      const batch = tokens.slice(offset, offset + 500);
      const response = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: { title, body },
        data,
        android: { priority: "high" },
      });

      const invalidTokens = response.responses.flatMap((result, index) => {
        const code = result.error?.code;
        const token = batch[index];
        return token &&
          (code === "messaging/registration-token-not-registered" ||
            code === "messaging/invalid-registration-token")
          ? [token]
          : [];
      });
      if (!invalidTokens.length) continue;

      const { error: deleteError } = await supabaseAdmin
        .from("admin_push_tokens")
        .delete()
        .in("token", invalidTokens);
      if (deleteError) {
        console.error(
          `Could not remove expired admin push tokens (${context}):`,
          deleteError.message,
        );
      }
    }
  } catch (error) {
    console.error(`${context} push notification failed:`, error);
  }
}
