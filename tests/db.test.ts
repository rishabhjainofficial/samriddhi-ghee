import assert from "node:assert";
import { prisma } from "../src/lib/prisma";

async function testDatabase() {
  console.log("Running database and catalog seed verification...");

  // Verify products & variants
  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
  });

  assert(products.length === 1, "Expected exactly 1 seeded product in catalog");
  const a2Ghee = products.find((p) => p.slug.includes("a2") && p.slug.includes("ghee"));
  assert(a2Ghee, "Expected Sanvrit A2 Desi Cow Ghee in seeded catalog");
  assert(a2Ghee.variants.length === 2, "Expected exactly 2 variants (1L and 5L)");

  const v1L = a2Ghee.variants.find((v) => v.title.includes("1000") || v.title.includes("1 Litre"));
  assert(v1L, "Expected 1L variant");
  assert(v1L.weightInGrams > 0, "Expected weightInGrams for logistics");
  assert(v1L.lengthCm > 0, "Expected dimensions for Shiprocket");

  // Verify Store Settings (Optional Taxes & Shipping)
  const settings = await prisma.storeSetting.findMany();
  const taxSetting = settings.find((s) => s.key === "enableTax");
  const shippingSetting = settings.find((s) => s.key === "enableShippingFee");

  assert(taxSetting && taxSetting.value === "false", "Expected enableTax to default to false");
  assert(shippingSetting && shippingSetting.value === "false", "Expected enableShippingFee to default to false");

  // Verify Admin User seeded
  const admin = await prisma.adminUser.findFirst();
  assert(admin, "Expected seeded admin user");

  console.log("✓ All database seed and model assertions passed successfully!");
}

testDatabase()
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
