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
    { key: "supportPhone", value: "+91 98765 43210" },
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
      title: "Sanvrit A2 Desi Cow Ghee",
      slug: "sanvrit-a2-desi-cow-ghee",
      description:
        "Made with the traditional Vedic Bilona method from fresh whole milk curd of free-grazing indigenous cows. Slow-simmered over gentle flame in brass vessels to retain sacred golden granules, medicinal fatty acids, and authentic taste of purity.",
      benefits:
        "• Made with traditional Vedic Bilona method (Curd to Makkhan to Ghee)\n• Granular 'Danedaar' golden aroma & pure authentic taste\n• Rich in A2 beta-casein protein and natural fat-soluble vitamins (A, D, E, K)\n• Enhances digestive Agni, natural immunity, and cognitive stamina\n• Sealed in airtight food-grade glass packaging with zero chemical leaching\n• FSSAI Lic. No. 22225088000714 certified pure",
      ingredients: "100% Pure Cultured Butterfat from A2 Desi Cow Whole Milk Curd.",
      images: JSON.stringify([
        "/images/sanvrit-a2-ghee-front.webp",
        "/images/sanvrit-a2-ghee-back.webp",
      ]),
      categoryId: gheeCategory.id,
      isActive: true,
      variants: {
        create: [
          {
            title: "1000 ml (1 Litre) Glass Jar",
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
            title: "5000 ml (5 Litre) Container",
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
