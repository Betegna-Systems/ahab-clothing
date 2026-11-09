import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizePromoCode,
  orderTotals,
  priceOrder,
  promoStatus,
  type Promo,
  type PromoRow,
} from "./order-pricing.ts";
import {
  canClaimOrder,
  canSubmitReceipt,
  generateOrderNumber,
  isOrderOwner,
  isPaymentConfirmed,
  isWellFormedOrderLink,
  ORDER_NUMBER_PATTERN,
  paymentStatusLabel,
  reviewEligibility,
} from "./order-access.ts";

const catalog = [
  {
    slug: "taitu-double-breasted-suit",
    name: "Taitu Double-Breasted Suit",
    price: 4200,
    colors: [{ name: "Chocolate", hex: "#000" }],
    sizes: ["XS", "S", "M"],
    images: ["taitu.jpg"],
    inStock: true,
  },
  {
    slug: "bete-seamless-crew",
    name: "Bete Seamless Crew",
    price: 1200,
    colors: [
      { name: "Ivory", hex: "#fff" },
      { name: "Black", hex: "#000" },
    ],
    sizes: ["S", "M"],
    images: ["bete-ivory.jpg", "bete-black.jpg"],
    inStock: true,
  },
  {
    slug: "sold-out-top",
    name: "Sold Out Top",
    price: 900,
    colors: [{ name: "Black", hex: "#000" }],
    sizes: ["M"],
    images: ["x.jpg"],
    inStock: false,
  },
];

const AHAB10: Promo = { code: "AHAB10", percentOff: 10, minSubtotal: 0 };

describe("order pricing", () => {
  it("charges delivery below the free-shipping threshold", () => {
    assert.deepEqual(orderTotals(4200, null), {
      subtotal: 4200,
      discount: 0,
      shipping: 250,
      total: 4450,
      promoCode: null,
    });
  });

  it("gives free delivery from 5000 ETB, based on the pre-discount subtotal", () => {
    assert.deepEqual(orderTotals(5400, AHAB10), {
      subtotal: 5400,
      discount: 540,
      shipping: 0,
      total: 4860,
      promoCode: "AHAB10",
    });
  });

  it("uses catalog prices and images, ignoring browser-supplied prices", () => {
    const priced = priceOrder(
      [{ slug: "bete-seamless-crew", color: "Black", size: "M", qty: 2, price: 1 } as never],
      catalog,
      null,
    );
    assert.equal(priced.ok, true);
    if (!priced.ok) return;
    assert.equal(priced.items[0]!.price, 1200);
    assert.equal(priced.items[0]!.image, "bete-black.jpg");
    assert.equal(priced.subtotal, 2400);
    assert.equal(priced.total, 2650);
  });

  it("applies a validated promo and reports its percent for the database check", () => {
    const line = { slug: "taitu-double-breasted-suit", color: "Chocolate", size: "M", qty: 1 };
    const priced = priceOrder([line], catalog, {
      code: "MADEWITHLOVE",
      percentOff: 15,
      minSubtotal: 0,
    });
    assert.equal(priced.ok && priced.promoCode, "MADEWITHLOVE");
    assert.equal(priced.ok && priced.promoPercent, 15);
    assert.equal(priced.ok && priced.discount, 630);
  });

  it("does not apply a promo below its minimum order (and records no code)", () => {
    const line = { slug: "bete-seamless-crew", color: "Black", size: "M", qty: 1 };
    const priced = priceOrder([line], catalog, {
      code: "BIG20",
      percentOff: 20,
      minSubtotal: 3000,
    });
    assert.equal(priced.ok && priced.discount, 0);
    assert.equal(priced.ok && priced.promoCode, null);
    assert.equal(priced.ok && priced.promoPercent, null);
    const two = priceOrder([{ ...line, qty: 3 }], catalog, {
      code: "BIG20",
      percentOff: 20,
      minSubtotal: 3000,
    });
    assert.equal(two.ok && two.discount, 720);
  });

  for (const [label, line] of [
    ["unknown product", { slug: "nope", color: "Black", size: "M", qty: 1 }],
    ["unknown colour", { slug: "bete-seamless-crew", color: "Red", size: "M", qty: 1 }],
    [
      "colour with different case",
      { slug: "bete-seamless-crew", color: "black", size: "M", qty: 1 },
    ],
    ["unknown size", { slug: "bete-seamless-crew", color: "Black", size: "XXL", qty: 1 }],
    ["out-of-stock product", { slug: "sold-out-top", color: "Black", size: "M", qty: 1 }],
    ["zero quantity", { slug: "bete-seamless-crew", color: "Black", size: "M", qty: 0 }],
    ["fractional quantity", { slug: "bete-seamless-crew", color: "Black", size: "M", qty: 1.5 }],
  ] as const) {
    it(`rejects an ${label}`, () => {
      assert.deepEqual(priceOrder([line], catalog, null), { ok: false, reason: "unavailable" });
    });
  }
});

const TOKEN = "a".repeat(64);
const OTHER_TOKEN = "b".repeat(64);
const USER = "11111111-1111-1111-1111-111111111111";
const OTHER_USER = "22222222-2222-2222-2222-222222222222";

describe("order ownership", () => {
  it("never treats unlinked orders as owned", () => {
    assert.equal(isOrderOwner({ customer_user_id: null }, USER), false);
    assert.equal(isOrderOwner({ customer_user_id: OTHER_USER }, USER), false);
    assert.equal(isOrderOwner({ customer_user_id: USER }, USER), true);
  });

  it("requires the private tracking token to claim a guest order", () => {
    const order = { customer_user_id: null, payment_access_token_hash: TOKEN };
    assert.equal(canClaimOrder(order, TOKEN, USER), "claim");
    assert.equal(canClaimOrder(order, OTHER_TOKEN, USER), "order_not_found");
    assert.equal(canClaimOrder(null, TOKEN, USER), "order_not_found");
  });

  it("does not let a second account take over a claimed order", () => {
    const order = { customer_user_id: OTHER_USER, payment_access_token_hash: TOKEN };
    assert.equal(canClaimOrder(order, TOKEN, USER), "claimed_by_other");
    assert.equal(canClaimOrder(order, TOKEN, OTHER_USER), "already_yours");
  });

  it("rejects orders that have no token hash", () => {
    const order = { customer_user_id: null, payment_access_token_hash: null };
    assert.equal(canClaimOrder(order, "", USER), "order_not_found");
  });
});

describe("payment receipt access", () => {
  const order = {
    payment_access_token_hash: TOKEN,
    payment_method: "Telebirr",
    payment_status: "pending",
  };

  it("accepts a receipt only with the order token while payment is pending", () => {
    assert.equal(canSubmitReceipt(order, TOKEN), "accept");
    assert.equal(canSubmitReceipt(order, OTHER_TOKEN), "order_not_found");
    assert.equal(
      canSubmitReceipt({ ...order, payment_status: "receipt_submitted" }, TOKEN),
      "already_submitted",
    );
  });

  it("does not accept receipts for cash-on-delivery orders", () => {
    assert.equal(
      canSubmitReceipt({ ...order, payment_method: "Cash on delivery" }, TOKEN),
      "order_not_found",
    );
  });
});

describe("review eligibility", () => {
  const order = {
    payment_access_token_hash: TOKEN,
    status: " Delivered ",
    items: [{ slug: "bete-seamless-crew", name: "Bete" }],
  };

  it("allows reviews for purchased products on delivered orders", () => {
    assert.equal(reviewEligibility(order, TOKEN, "bete-seamless-crew"), "allow");
  });

  it("rejects undelivered orders, other products, and wrong tokens", () => {
    assert.equal(
      reviewEligibility({ ...order, status: "Confirmed" }, TOKEN, "bete-seamless-crew"),
      "not_delivered",
    );
    assert.equal(
      reviewEligibility(order, TOKEN, "taitu-double-breasted-suit"),
      "product_not_ordered",
    );
    assert.equal(reviewEligibility(order, OTHER_TOKEN, "bete-seamless-crew"), "order_not_found");
  });
});

describe("order links", () => {
  const uuid = "3f2b8c1e-9a4d-4e6f-8b2a-1c3d5e7f9a0b";

  it("generates random order numbers the tracking routes accept", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const number = generateOrderNumber((bytes) => crypto.getRandomValues(bytes));
      assert.match(number, ORDER_NUMBER_PATTERN);
      assert.doesNotMatch(number.slice(5), /[01IO]/);
      seen.add(number);
    }
    assert.equal(seen.size, 200);
  });

  it("treats missing or malformed links as unavailable instead of throwing", () => {
    assert.equal(isWellFormedOrderLink("AHAB-7K2M9QXP", uuid), true);
    assert.equal(isWellFormedOrderLink("AHAB-7K2M9QXP", undefined), false);
    assert.equal(isWellFormedOrderLink("AHAB-7K2M9QXP", "not-a-uuid"), false);
    assert.equal(isWellFormedOrderLink("ahab-7k2m9qxp", uuid), false);
    assert.equal(isWellFormedOrderLink("AHAB-<script>", uuid), false);
  });
});

describe("payment status", () => {
  it("treats the admin app's 'paid' (and legacy 'confirmed') as confirmed", () => {
    assert.equal(isPaymentConfirmed("paid"), true);
    assert.equal(isPaymentConfirmed("confirmed"), true);
    assert.equal(isPaymentConfirmed("receipt_submitted"), false);
    assert.equal(isPaymentConfirmed("pending"), false);
  });

  it("labels payment state for customers", () => {
    assert.equal(paymentStatusLabel("paid", "Telebirr"), "Payment confirmed");
    assert.equal(
      paymentStatusLabel("receipt_submitted", "CBE bank transfer"),
      "Receipt received, being verified",
    );
    assert.equal(paymentStatusLabel("pending", "Telebirr"), "Awaiting payment");
    assert.equal(paymentStatusLabel("pending", "Cash on delivery"), "Pay on delivery");
  });
});

describe("promo codes", () => {
  const row: PromoRow = {
    code: "LAUNCH20",
    percent_off: 20,
    active: true,
    starts_at: "2026-11-01T00:00:00Z",
    expires_at: "2026-12-01T00:00:00Z",
    max_uses: 2,
    min_subtotal: 0,
  };
  const now = new Date("2026-11-15T12:00:00Z");

  it("normalizes typed codes and rejects impossible ones", () => {
    assert.equal(normalizePromoCode(" launch20 "), "LAUNCH20");
    assert.equal(normalizePromoCode("ab"), null);
    assert.equal(normalizePromoCode("NO SPACES"), null);
    assert.equal(normalizePromoCode(undefined), null);
  });

  it("allows an active code inside its dates and under its limit", () => {
    assert.equal(promoStatus(row, now, 1), "ok");
    assert.equal(promoStatus({ ...row, max_uses: null }, now, 999), "ok");
  });

  it("rejects missing, paused, early, expired and used-up codes", () => {
    assert.equal(promoStatus(null, now, 0), "not_found");
    assert.equal(promoStatus({ ...row, active: false }, now, 0), "inactive");
    assert.equal(promoStatus(row, new Date("2026-10-31T23:59:59Z"), 0), "not_started");
    assert.equal(promoStatus(row, new Date("2026-12-01T00:00:00Z"), 0), "expired");
    assert.equal(promoStatus(row, now, 2), "used_up");
  });
});
