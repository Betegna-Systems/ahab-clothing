import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type OrderAlert = {
  orderNumber: string;
  total: number;
  paymentMethod: string;
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

function getFirebaseAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = process.env["FIREBASE_PROJECT_ID"];
  const clientEmail = process.env["FIREBASE_CLIENT_EMAIL"];
  const privateKey = process.env["FIREBASE_PRIVATE_KEY"]?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are not configured.");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
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

  try {
    const { data: devices, error } = await supabaseAdmin.from("admin_push_tokens").select("token");

    if (error) throw error;
    if (!devices?.length) return;

    const app = getFirebaseAdminApp();
    const messaging = getMessaging(app);
    const tokens = devices.map(({ token }) => token);

    for (let offset = 0; offset < tokens.length; offset += 500) {
      const batch = tokens.slice(offset, offset + 500);
      const response = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: {
          title: "New AHAB order",
          body: `${order.orderNumber} - ETB ${order.total.toLocaleString()}`,
        },
        data: {
          type: "new_order",
          orderNumber: order.orderNumber,
        },
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

      if (invalidTokens.length) {
        const { error: deleteError } = await supabaseAdmin
          .from("admin_push_tokens")
          .delete()
          .in("token", invalidTokens);
        if (deleteError) {
          console.error("Could not remove expired admin push tokens:", deleteError.message);
        }
      }
    }
  } catch (error) {
    console.error("New order push notification failed:", error);
  }
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
