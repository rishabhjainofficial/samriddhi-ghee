import assert from "node:assert";
import { prisma } from "../src/lib/prisma";
import { calculateOrderTotals } from "../src/lib/utils/pricing";

async function testAdminSettings() {
  console.log("Testing Dynamic Store Settings for Taxes & Shipping...");

  // 1. Initial State (Both disabled by default)
  let settings = await prisma.storeSetting.findMany();
  let enableTax = settings.find((s) => s.key === "enableTax")?.value === "true";
  let enableShipping = settings.find((s) => s.key === "enableShippingFee")?.value === "true";

  assert.strictEqual(enableTax, false);
  assert.strictEqual(enableShipping, false);

  const initialTotals = calculateOrderTotals(1000, {
    enableTax,
    enableShippingFee: enableShipping,
  });
  assert.strictEqual(initialTotals.taxAmount, 0);
  assert.strictEqual(initialTotals.shippingFee, 0);
  assert.strictEqual(initialTotals.totalAmount, 1000);

  // 2. Update to Enable 5% Tax and ₹80 Shipping Fee
  await prisma.storeSetting.upsert({
    where: { key: "enableTax" },
    update: { value: "true" },
    create: { key: "enableTax", value: "true" },
  });
  await prisma.storeSetting.upsert({
    where: { key: "taxRate" },
    update: { value: "5" },
    create: { key: "taxRate", value: "5" },
  });
  await prisma.storeSetting.upsert({
    where: { key: "enableShippingFee" },
    update: { value: "true" },
    create: { key: "enableShippingFee", value: "true" },
  });
  await prisma.storeSetting.upsert({
    where: { key: "flatShippingRate" },
    update: { value: "80" },
    create: { key: "flatShippingRate", value: "80" },
  });
  await prisma.storeSetting.upsert({
    where: { key: "freeShippingThreshold" },
    update: { value: "1500" },
    create: { key: "freeShippingThreshold", value: "1500" },
  });

  const updatedSettings = await prisma.storeSetting.findMany();
  const newEnableTax = updatedSettings.find((s) => s.key === "enableTax")?.value === "true";
  const newTaxRate = parseFloat(updatedSettings.find((s) => s.key === "taxRate")?.value || "0");
  const newEnableShipping = updatedSettings.find((s) => s.key === "enableShippingFee")?.value === "true";
  const newFlatShipping = parseFloat(updatedSettings.find((s) => s.key === "flatShippingRate")?.value || "0");
  const newThreshold = parseFloat(updatedSettings.find((s) => s.key === "freeShippingThreshold")?.value || "0");

  assert.strictEqual(newEnableTax, true);
  assert.strictEqual(newTaxRate, 5);
  assert.strictEqual(newEnableShipping, true);
  assert.strictEqual(newFlatShipping, 80);

  // Test below threshold (1000 subtotal)
  const totalsWithFees = calculateOrderTotals(1000, {
    enableTax: newEnableTax,
    taxRate: newTaxRate,
    enableShippingFee: newEnableShipping,
    flatShippingRate: newFlatShipping,
    freeShippingThreshold: newThreshold,
  });
  assert.strictEqual(totalsWithFees.taxAmount, 50); // 5% of 1000
  assert.strictEqual(totalsWithFees.shippingFee, 80);
  assert.strictEqual(totalsWithFees.totalAmount, 1130); // 1000 + 50 + 80

  // 3. Reset back to safe defaults (false / 0)
  await prisma.storeSetting.update({ where: { key: "enableTax" }, data: { value: "false" } });
  await prisma.storeSetting.update({ where: { key: "taxRate" }, data: { value: "0" } });
  await prisma.storeSetting.update({ where: { key: "enableShippingFee" }, data: { value: "false" } });
  await prisma.storeSetting.update({ where: { key: "flatShippingRate" }, data: { value: "0" } });

  console.log("✓ Dynamic Store Settings & Optional Taxes / Shipping verified successfully!");
}

testAdminSettings()
  .catch((err) => {
    console.error("Settings test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
