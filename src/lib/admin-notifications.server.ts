import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

export async function notifyAdminsOfNewOrder(order: {
  orderNumber: string;
  total: number;
}) {
  try {
    const { data: devices, error } = await supabaseAdmin
      .from("admin_push_tokens")
      .select("token");

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
        return token && (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token"
        )
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
