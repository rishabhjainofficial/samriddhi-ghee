import assert from "node:assert";
import { calculateOrderTotals } from "../src/lib/utils/pricing";
import { lookupPincode } from "../src/lib/utils/pincode";

async function testCartAndPricing() {
  console.log("Testing Pricing Engine & Pincode Lookup...");

  // Case 1: All charges & taxes disabled (Default)
  const defaultSettings = {
    enableTax: false,
    taxRate: 0,
    enableShippingFee: false,
    flatShippingRate: 0,
    freeShippingThreshold: 999,
  };

  const totals1 = calculateOrderTotals(1199, defaultSettings);
  assert.strictEqual(totals1.subtotal, 1199);
  assert.strictEqual(totals1.shippingFee, 0, "Expected shipping fee to be 0 when disabled");
  assert.strictEqual(totals1.taxAmount, 0, "Expected tax to be 0 when disabled");
  assert.strictEqual(totals1.totalAmount, 1199, "Expected Total = Subtotal when charges disabled");
  assert.strictEqual(totals1.isFreeShipping, true);

  // Case 2: Shipping fee enabled, cart below threshold
  const withShippingSettings = {
    enableTax: false,
    taxRate: 0,
    enableShippingFee: true,
    flatShippingRate: 70,
    freeShippingThreshold: 999,
  };

  const totals2 = calculateOrderTotals(649, withShippingSettings);
  assert.strictEqual(totals2.subtotal, 649);
  assert.strictEqual(totals2.shippingFee, 70, "Expected flat shipping fee of 70 below threshold");
  assert.strictEqual(totals2.totalAmount, 719, "Expected 649 + 70 = 719");
  assert.strictEqual(totals2.amountNeededForFreeShipping, 350, "Expected 999 - 649 = 350 needed");

  // Case 3: Shipping fee enabled, cart exceeds threshold
  const totals3 = calculateOrderTotals(1199, withShippingSettings);
  assert.strictEqual(totals3.shippingFee, 0, "Expected free shipping above threshold");
  assert.strictEqual(totals3.totalAmount, 1199);
  assert.strictEqual(totals3.amountNeededForFreeShipping, 0);

  // Case 4: Tax enabled (e.g. 5%)
  const withTaxSettings = {
    enableTax: true,
    taxRate: 5,
    enableShippingFee: false,
    flatShippingRate: 0,
    freeShippingThreshold: 999,
  };
  const totals4 = calculateOrderTotals(1000, withTaxSettings);
  assert.strictEqual(totals4.taxAmount, 50, "Expected 5% tax of 1000 = 50");
  assert.strictEqual(totals4.totalAmount, 1050, "Expected 1000 + 50 = 1050");

  // Case 5: Pincode Lookup
  const delhi = lookupPincode("110001");
  assert(delhi, "Expected lookup for 110001");
  assert.strictEqual(delhi.state, "Delhi");

  const blr = lookupPincode("560001");
  assert(blr, "Expected lookup for 560001");
  assert.strictEqual(blr.city, "Bengaluru");

  const unknown = lookupPincode("999999");
  assert.strictEqual(unknown, null, "Expected null for unknown pincode");

  console.log("✓ All cart and pricing calculations verified!");
}

testCartAndPricing().catch((err) => {
  console.error("Cart & pricing test failed:", err);
  process.exit(1);
});
