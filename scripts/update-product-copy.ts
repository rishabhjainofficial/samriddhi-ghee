import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Updating product details with new copy & pack titles...");

  const product = await prisma.product.findFirst({
    include: { variants: true },
  });

  if (!product) {
    console.error("No product found in database to update!");
    process.exit(1);
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      title: "Sanvrit A2 Desi Cow Bilona Ghee",
      description:
        "Handcrafted in small batches in Udaipur from the whole milk of free-grazing indigenous Gir cows. Unlike commercial cream-based ghee, Sanvrit Ghee is cultured overnight into curd, bi-directionally churned using a traditional wooden madhani before sunrise, and slow-simmered under controlled heat to lock in its natural aroma, rich granular (danedaar) texture, and essential nutrients.",
      benefits:
        "• 100% Curd-Churned (Vedic Bilona Method): Made strictly from whole milk curd—never directly from industrial cream or malai.\n• Single-Origin Gir Cow A2 Milk: Sourced from grass-fed, free-grazing native cows raised without synthetic hormones.\n• Controlled Small-Batch Simmering: Gently clarified to preserve healthy fatty acids (including butyric acid and omega-3s) without burning or bitterness.\n• Pure & Unadulterated: Zero preservatives, palm oil, vanaspati, artificial colours, or added flavours.",
      ingredients:
        "100% Pure Cultured Butterfat from A2 Gir Cow Whole Milk Curd (Traditional Bilona Churned in Udaipur, Rajasthan).",
    },
  });

  console.log(`Updated product: ${updated.title} (ID: ${updated.id})`);

  for (const v of product.variants) {
    let newTitle = v.title;
    if (v.sku.includes("1L") || v.weightInGrams <= 2000) {
      newTitle = "1 Litre Glass Jar";
    } else if (v.sku.includes("5L") || v.weightInGrams > 2000) {
      newTitle = "5 Litre Family Container";
    }
    await prisma.productVariant.update({
      where: { id: v.id },
      data: { title: newTitle },
    });
    console.log(`Updated variant ${v.sku} -> ${newTitle}`);
  }

  console.log("✓ Database update complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
