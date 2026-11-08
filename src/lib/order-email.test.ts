import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildOrderConfirmationEmail, type OrderEmailInput } from "./order-email.ts";

const base: OrderEmailInput = {
  orderNumber: "AHAB-7K2M9QXP",
  customerName: "Selam Tesfaye",
  items: [
    { name: "Taitu Double-Breasted Suit", color: "Chocolate", size: "M", qty: 1, price: 9800 },
  ],
  subtotal: 9800,
  discount: 980,
  shipping: 0,
  total: 8820,
  paymentMethod: "Telebirr",
  paymentAccount: "+251900000000",
  trackingUrl: "https://example.com/tracking/AHAB-7K2M9QXP?token=t",
  paymentUrl: "https://example.com/payment/AHAB-7K2M9QXP?token=t",
};

describe("order confirmation email", () => {
  it("includes the order, totals, payment instructions and private links", () => {
    const email = buildOrderConfirmationEmail(base);
    assert.equal(email.subject, "Your AHAB order AHAB-7K2M9QXP");
    for (const part of [
      "ETB 8,820",
      "Discount: -ETB 980",
      "+251900000000",
      base.trackingUrl,
      base.paymentUrl!,
    ]) {
      assert.ok(email.text.includes(part), `text is missing ${part}`);
    }
    assert.ok(email.html.includes("Upload receipt"));
    assert.ok(email.html.includes("Thank you, Selam."));
  });

  it("omits the receipt step for cash on delivery", () => {
    const email = buildOrderConfirmationEmail({
      ...base,
      paymentMethod: "Cash on delivery",
      paymentAccount: "",
      paymentUrl: null,
    });
    assert.ok(email.text.includes("You pay when your order arrives"));
    assert.ok(!email.html.includes("Upload receipt"));
  });

  it("escapes customer-entered text in the HTML", () => {
    const email = buildOrderConfirmationEmail({
      ...base,
      customerName: '<img src=x onerror="alert(1)">',
      items: [{ ...base.items[0]!, color: "<b>Red</b>" }],
    });
    assert.ok(!email.html.includes("<img src=x"));
    assert.ok(!email.html.includes("<b>Red</b>"));
    assert.ok(email.html.includes("&lt;b&gt;Red&lt;/b&gt;"));
  });

  it("writes Amharic emails with /am/ links when the shopper checked out in Amharic", () => {
    const email = buildOrderConfirmationEmail({
      ...base,
      customerName: "<b>ሰላም</b> ተስፋዬ",
      trackingUrl: "https://example.com/am/tracking/AHAB-7K2M9QXP?token=t",
      paymentUrl: "https://example.com/am/payment/AHAB-7K2M9QXP?token=t",
      locale: "am",
    });
    const ethiopic = /[ሀ-፿]/;
    assert.ok(ethiopic.test(email.subject), "subject is not in Amharic");
    assert.ok(email.subject.includes("AHAB-7K2M9QXP"));
    assert.ok(email.text.includes("ጠቅላላ: ETB 8,820"));
    assert.ok(email.text.includes("https://example.com/am/payment/AHAB-7K2M9QXP?token=t"));
    assert.ok(email.html.includes('href="https://example.com/am/tracking/AHAB-7K2M9QXP?token=t"'));
    assert.ok(!email.text.includes("Track your order"));
    assert.ok(!email.html.includes("Upload receipt"));
    assert.ok(!email.html.includes("Thank you"));
    assert.ok(email.html.includes("&lt;b&gt;ሰላም&lt;/b&gt;"));
    assert.ok(!email.html.includes("<b>ሰላም</b>"));
  });
});
