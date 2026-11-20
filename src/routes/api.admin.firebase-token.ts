import { createFileRoute } from "@tanstack/react-router";

// Exchanges the admin app's Supabase session for a Firebase custom token carrying the
// `admin` claim, which firestore.rules requires for product writes.
export const Route = createFileRoute("/api/admin/firebase-token")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 405, headers: { allow: "POST" } }),
      POST: async ({ request }) => {
        const { jsonResponse, requireAdminRequest } = await import("@/lib/admin-api.server");
        const admin = await requireAdminRequest(request);
        if ("response" in admin) return admin.response;

        try {
          const { createFirebaseCustomToken } = await import("@/lib/google-service-account.server");
          const token = await createFirebaseCustomToken(`supabase:${admin.userId}`, {
            admin: true,
          });
          return jsonResponse({ token });
        } catch (error) {
          console.error("Firebase admin token creation failed:", error);
          return jsonResponse({ error: "unavailable" }, 503);
        }
      },
    },
  },
});
