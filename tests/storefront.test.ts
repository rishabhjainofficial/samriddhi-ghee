import assert from "node:assert";
import { prisma } from "../src/lib/prisma";

async function testStorefrontData() {
  console.log("Verifying storefront data queries & catalog rendering integrity...");

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      category: true,
    },
  });

  assert(products.length === 1, "Expected exactly 1 active product in storefront");

  for (const product of products) {
    assert(product.title.length > 0, "Product title must not be empty");
    assert(product.slug.length > 0, "Product slug must not be empty");
    assert(product.variants.length === 2, `Product ${product.title} must have exactly 2 variants (1L and 5L)`);

    const minPrice = product.variants[0].price;
    assert(minPrice > 0, "Variant price must be positive");

    const images = JSON.parse(product.images);
    assert(Array.isArray(images) && images.length > 0, "Product must have at least 1 image");
  }

  // Check A2 Desi Cow Ghee specific variant pricing
  const a2Ghee = products.find((p) => p.slug.includes("a2"));
  assert(a2Ghee, "A2 Ghee must exist");
  const var1L = a2Ghee.variants.find((v) => v.title.includes("1000") || v.title.includes("1 Litre"));
  assert(var1L && var1L.price === 2249, "1L A2 Ghee price must be 2249");
  assert(var1L.mrp === 2700, "1L A2 Ghee MRP must be 2700");
  assert(var1L.mrp > var1L.price, "MRP must be greater than selling price to display savings");

  console.log("✓ Storefront product data and variant tier integrity verified!");
}

testStorefrontData().catch((err) => {
  console.error("Storefront test failed:", err);
  process.exit(1);
});
