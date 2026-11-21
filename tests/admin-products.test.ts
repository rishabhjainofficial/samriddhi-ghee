import assert from "node:assert";
import { prisma } from "../src/lib/prisma";

async function testAdminProducts() {
  console.log("Testing Product Master CRUD & Variant Management...");

  // 1. Get or create category
  const category = await prisma.category.findFirst();
  assert(category, "Expected seeded category");

  // 2. Create Product with multiple variants
  const slug = `test-artisanal-ghee-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      title: "Test Artisanal Vedic Ghee",
      slug,
      description: "Sample test artisanal ghee description.",
      categoryId: category.id,
      images: JSON.stringify(["https://example.com/ghee.jpg"]),
      variants: {
        create: [
          {
            title: "500 ml Glass Jar",
            sku: `TEST-SKU-500-${Date.now()}`,
            price: 999,
            mrp: 1200,
            stockQuantity: 40,
            weightInGrams: 850,
            lengthCm: 12,
            breadthCm: 12,
            heightCm: 16,
          },
          {
            title: "1000 ml Glass Jar",
            sku: `TEST-SKU-1000-${Date.now()}`,
            price: 1899,
            mrp: 2200,
            stockQuantity: 20,
            weightInGrams: 1600,
            lengthCm: 14,
            breadthCm: 14,
            heightCm: 22,
          },
        ],
      },
    },
    include: { variants: true },
  });

  assert(product.id, "Product must be created with ID");
  assert.strictEqual(product.variants.length, 2, "Must create 2 variants");

  // 3. Update stock and price of a variant
  const updatedVariant = await prisma.productVariant.update({
    where: { id: product.variants[0].id },
    data: { stockQuantity: 55, price: 1049 },
  });
  assert.strictEqual(updatedVariant.stockQuantity, 55);
  assert.strictEqual(updatedVariant.price, 1049);

  // 4. Archive (toggle isActive)
  const archived = await prisma.product.update({
    where: { id: product.id },
    data: { isActive: false },
  });
  assert.strictEqual(archived.isActive, false);

  // Clean up test product
  await prisma.product.delete({ where: { id: product.id } });

  console.log("✓ Product Master & Variant Management CRUD verified successfully!");
}

testAdminProducts()
  .catch((err) => {
    console.error("Product management test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
