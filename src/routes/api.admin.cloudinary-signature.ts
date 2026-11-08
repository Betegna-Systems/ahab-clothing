import { createFileRoute } from "@tanstack/react-router";
import { cloudinarySignature, PRODUCT_UPLOAD_FOLDER } from "@/lib/admin-api";

// Signs a single product-photo upload for the admin app so the Cloudinary API secret
// stays on the server and the account no longer needs an unsigned upload preset.
export const Route = createFileRoute("/api/admin/cloudinary-signature")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 405, headers: { allow: "POST" } }),
      POST: async ({ request }) => {
        const { jsonResponse, requireAdminRequest } = await import("@/lib/admin-api.server");
        const admin = await requireAdminRequest(request);
        if ("response" in admin) return admin.response;

        const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
        const apiKey = process.env["CLOUDINARY_API_KEY"];
        const apiSecret = process.env["CLOUDINARY_API_SECRET"];
        if (!cloudName || !apiKey || !apiSecret) {
          console.error("Cloudinary signing is not configured.");
          return jsonResponse({ error: "unavailable" }, 503);
        }

        // Signatures are valid for one hour from this timestamp.
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = PRODUCT_UPLOAD_FOLDER;
        const signature = await cloudinarySignature({ folder, timestamp }, apiSecret);
        return jsonResponse({ cloudName, apiKey, folder, timestamp, signature });
      },
    },
  },
});
