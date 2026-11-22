import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding Sanvrit Ghee database...");

  // 1. Seed Admin User
  const defaultPassword = "AdminPassword@123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@sanvritghee.com" },
    update: {
      name: "Sanvrit Store Admin",
      passwordHash,
    },
    create: {
      email: "admin@sanvritghee.com",
      name: "Sanvrit Store Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Seeded Admin: ${admin.email}`);

  // 2. Seed Store Settings (All charges & taxes optional, default OFF)
  const defaultSettings = [
    { key: "enableTax", value: "false" },
    { key: "taxRate", value: "0" },
    { key: "enableShippingFee", value: "false" },
    { key: "flatShippingRate", value: "0" },
    { key: "freeShippingThreshold", value: "999" },
    { key: "isCodEnabled", value: "false" },
    { key: "supportPhone", value: "+91 86900 54729" },
    { key: "supportEmail", value: "support@sanvritghee.com" },
    { key: "storeNotice", value: "Sanvrit Pure A2 Gir Cow Cultured Bilona Ghee. Taste of Purity." },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("Seeded Store Settings");

  // 3. Seed Category
  const gheeCategory = await prisma.category.upsert({
    where: { slug: "desi-ghee" },
    update: {},
    create: {
      name: "Desi Ghee",
      slug: "desi-ghee",
      description: "Traditional hand-churned Vedic Bilona pure Desi Ghee.",
    },
  });

  // 4. Clean up old products, orders and seed ONLY 1 Ghee Product with 1L and 5L variants
  await prisma.orderItem.deleteMany({});
  await prisma.shippingAddress.deleteMany({});
  await prisma.paymentTransaction.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});

  const sanvritGhee = await prisma.product.create({
    data: {
      title: "Sanvrit A2 Desi Cow Bilona Ghee",
      slug: "sanvrit-a2-desi-cow-ghee",
      description:
        "Handcrafted in small batches in Udaipur from the whole milk of free-grazing indigenous Gir cows. Unlike commercial cream-based ghee, Sanvrit Ghee is cultured overnight into curd, bi-directionally churned using a traditional wooden madhani before sunrise, and slow-simmered under controlled heat to lock in its natural aroma, rich granular (danedaar) texture, and essential nutrients.",
      benefits:
        "• 100% Curd-Churned (Vedic Bilona Method): Made strictly from whole milk curd—never directly from industrial cream or malai.\n• Single-Origin Gir Cow A2 Milk: Sourced from grass-fed, free-grazing native cows raised without synthetic hormones.\n• Controlled Small-Batch Simmering: Gently clarified to preserve healthy fatty acids (including butyric acid and omega-3s) without burning or bitterness.\n• Pure & Unadulterated: Zero preservatives, palm oil, vanaspati, artificial colours, or added flavours.",
      ingredients:
        "100% Pure Cultured Butterfat from A2 Gir Cow Whole Milk Curd (Traditional Bilona Churned in Udaipur, Rajasthan).",
      images: JSON.stringify([
        "/images/sanvrit-a2-ghee-front.webp",
        "/images/sanvrit-a2-ghee-back.webp",
      ]),
      categoryId: gheeCategory.id,
      isActive: true,
      variants: {
        create: [
          {
            title: "1 Litre Glass Jar (1000 ml)",
            sku: "SANVRIT-A2-1L",
            price: 1200,
            mrp: 1500,
            stockQuantity: 100,
            weightInGrams: 1600,
            lengthCm: 14,
            breadthCm: 14,
            heightCm: 22,
            isActive: true,
          },
          {
            title: "5 Litre Family Container (5000 ml)",
            sku: "SANVRIT-A2-5L",
            price: 5500,
            mrp: 6500,
            stockQuantity: 30,
            weightInGrams: 5300,
            lengthCm: 22,
            breadthCm: 22,
            heightCm: 32,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log(`Seeded Product: ${sanvritGhee.title} (1L and 5L variants)`);

  console.log("✓ Sanvrit Ghee seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
