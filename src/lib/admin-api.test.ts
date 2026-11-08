import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bearerToken, cloudinarySignature, isVerifiedAdmin } from "./admin-api.ts";

describe("admin API access", () => {
  it("requires a confirmed email and the server-set admin role", () => {
    const confirmed = "2026-11-01T00:00:00Z";
    assert.equal(
      isVerifiedAdmin({ email_confirmed_at: confirmed, app_metadata: { role: "admin" } }),
      true,
    );
    assert.equal(
      isVerifiedAdmin({ email_confirmed_at: null, app_metadata: { role: "admin" } }),
      false,
    );
    assert.equal(isVerifiedAdmin({ email_confirmed_at: confirmed, app_metadata: {} }), false);
    assert.equal(isVerifiedAdmin(null), false);
  });

  it("reads only well-formed bearer tokens", () => {
    assert.equal(
      bearerToken("Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig"),
      "eyJhbGciOiJIUzI1NiJ9.payload.sig",
    );
    assert.equal(bearerToken("Basic dXNlcjpwYXNz"), null);
    assert.equal(bearerToken("Bearer "), null);
    assert.equal(bearerToken(null), null);
  });
});

describe("cloudinary signing", () => {
  it("matches Cloudinary's documented signature example", async () => {
    const signature = await cloudinarySignature(
      {
        timestamp: 1315060510,
        public_id: "sample_image",
        eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
      },
      "abcd",
    );
    assert.equal(signature, "bfd09f95f331f558cbd1320e67aa8d488770583e");
  });
});
