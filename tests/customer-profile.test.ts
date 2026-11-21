import assert from "node:assert";
import { prisma } from "../src/lib/prisma";

async function testCustomerProfileAndAutofill() {
  console.log("Testing Customer Profile Creation & Checkout Autofill...");

  const phone = "9876599999";
  const email = "rahul.sharma@example.com";

  // 1. Create or update customer record as checkout does
  const customer = await prisma.customer.upsert({
    where: { phone },
    update: {
      name: "Rahul Sharma",
      email,
      addressLine1: "A-501, Orchid Whitefield",
      landmark: "Near Forum Mall",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
    },
    create: {
      name: "Rahul Sharma",
      phone,
      email,
      addressLine1: "A-501, Orchid Whitefield",
      landmark: "Near Forum Mall",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
    },
  });

  assert(customer.id, "Customer must have ID");
  assert.strictEqual(customer.name, "Rahul Sharma");

  // 2. Lookup by phone
  const foundByPhone = await prisma.customer.findUnique({ where: { phone } });
  assert(foundByPhone, "Must find customer by 10-digit phone");
  assert.strictEqual(foundByPhone.city, "Bengaluru");
  assert.strictEqual(foundByPhone.pincode, "560066");

  // 3. Lookup by email
  const foundByEmail = await prisma.customer.findUnique({ where: { email } });
  assert(foundByEmail, "Must find customer by email");
  assert.strictEqual(foundByEmail.phone, phone);

  // 4. Attach an order to this customer
  const variant = await prisma.productVariant.findFirst({ include: { product: true } });
  assert(variant);

  const order = await prisma.order.create({
    data: {
      orderNumber: `SG-CUST-${Date.now().toString().slice(-6)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email!,
      customerPhone: customer.phone,
      status: "PAID",
      subtotal: variant.price,
      totalAmount: variant.price,
      shippingAddress: {
        create: {
          recipientName: customer.name,
          phone: customer.phone,
          addressLine1: customer.addressLine1!,
          landmark: customer.landmark,
          city: customer.city!,
          state: customer.state!,
          pincode: customer.pincode!,
        },
      },
      items: {
        create: [
          {
            productId: variant.productId,
            variantId: variant.id,
            title: variant.product.title,
            variantTitle: variant.title,
            price: variant.price,
            quantity: 1,
            weightInGrams: variant.weightInGrams,
          },
        ],
      },
    },
  });

  // 5. Query customer's order history
  const customerWithOrders = await prisma.customer.findUnique({
    where: { id: customer.id },
    include: { orders: { include: { items: true } } },
  });

  assert(customerWithOrders?.orders.length! >= 1, "Customer must have past orders");
  assert(
    customerWithOrders?.orders.some((o) => o.orderNumber === order.orderNumber),
    "Customer order list must contain the newly created order"
  );

  console.log("✓ Customer profile creation, order history linking, and autofill lookup verified successfully!");
}

testCustomerProfileAndAutofill()
  .catch((err) => {
    console.error("Customer profile test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
