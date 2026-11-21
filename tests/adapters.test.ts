import assert from "node:assert";
import { getPaymentGateway } from "../src/lib/services/payment";
import { getShippingProvider } from "../src/lib/services/shipping";

async function testAdapters() {
  console.log("Testing Pluggable Payment & Shipping Service Adapters...");

  // 1. Test Payment Adapter
  const paymentGateway = getPaymentGateway();
  assert(paymentGateway, "Expected payment gateway instance");

  const paymentOrder = await paymentGateway.createPaymentOrder({
    orderId: "order_12345",
    amountInPaise: 119900,
    currency: "INR",
    customer: {
      name: "Ramesh Sharma",
      email: "ramesh@example.com",
      phone: "9876543210",
    },
  });

  assert(paymentOrder.gatewayOrderId.startsWith("mock_order_"), "Expected mock gateway order id");
  assert(paymentOrder.checkoutUrl?.includes("order_12345"), "Expected checkout url with orderId");

  const verificationSuccess = await paymentGateway.verifyPayment({
    orderId: "order_12345",
    gatewayPaymentId: "mock_pay_success_12345",
    gatewaySignature: "mock_sig_valid",
  });

  assert(verificationSuccess.isSuccessful === true, "Expected valid verification to succeed");
  assert(verificationSuccess.transactionId.length > 0, "Expected transaction ID");

  const verificationFail = await paymentGateway.verifyPayment({
    orderId: "order_12345",
    gatewayPaymentId: "mock_pay_fail_12345",
  });
  assert(verificationFail.isSuccessful === false, "Expected simulated failure to return false");

  // 2. Test Shipping Adapter
  const shippingProvider = getShippingProvider();
  assert(shippingProvider, "Expected shipping provider instance");

  const shipment = await shippingProvider.createShipment({
    orderId: "order_12345",
    orderItems: [
      { name: "Sanvrit A2 Desi Cow Ghee - 1L", sku: "SANVRIT-A2-1L", qty: 2, price: 2249 },
    ],
    shippingAddress: {
      name: "Ramesh Sharma",
      phone: "9876543210",
      address: "Flat 402, Lotus Heights, MG Road",
      landmark: "Near Metro Gate 2",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    totalWeightInGrams: 1700,
    dimensions: { lengthCm: 22, breadthCm: 18, heightCm: 15 },
  });

  assert(shipment.awbCode.startsWith("MOCK-AWB-"), "Expected mock AWB code");
  assert(shipment.courierName.length > 0, "Expected courier partner name");

  const tracking = await shippingProvider.trackShipment(shipment.awbCode);
  assert(tracking.currentStatus.length > 0, "Expected tracking status");
  assert(tracking.statusTimeline.length >= 3, "Expected status milestone timeline");

  console.log("✓ All payment and shipping adapter tests passed successfully!");
}

testAdapters().catch((err) => {
  console.error("Adapter test failed:", err);
  process.exit(1);
});
