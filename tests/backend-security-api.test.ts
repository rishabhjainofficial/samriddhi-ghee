import assert from "node:assert";
import { prisma } from "../src/lib/prisma";
import { authenticateAdmin, createSessionToken, verifySessionToken, getAdminFromRequest } from "../src/lib/auth";
import { POST as updateStatusHandler } from "../src/app/api/admin/orders/update-status/route";
import { POST as updateSettingsHandler } from "../src/app/api/admin/settings/route";
import { POST as dispatchHandler } from "../src/app/api/admin/shipping/dispatch/route";
import { POST as loginHandler } from "../src/app/api/admin/auth/login/route";
import { POST as verifyPaymentHandler } from "../src/app/api/payment/verify/route";
import { POST as createOrderHandler } from "../src/app/api/checkout/create-order/route";

async function testBackendSecurity() {
  console.log("=== Running Comprehensive Backend Security & API Correctness Tests ===");

  // 1. Session Token Cryptographic Integrity & Tampering Resistance
  console.log("1. Testing Token Cryptographic Integrity...");
  const admin = await prisma.adminUser.findFirst({ where: { email: "admin@sanvritghee.com" } });
  assert(admin, "Admin user must exist");

  const validToken = await createSessionToken({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  const verified = await verifySessionToken(validToken);
  assert(verified && verified.email === admin.email, "Valid token must verify");

  // Tampered payload
  const [b64Data, sig] = validToken.split(".");
  const tamperedPayload = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(b64Data, "base64url").toString()), role: "SUPER_ADMIN" })).toString("base64url");
  const tamperedToken = `${tamperedPayload}.${sig}`;
  const tamperedResult = await verifySessionToken(tamperedToken);
  assert.strictEqual(tamperedResult, null, "Tampered token payload must be rejected");

  // Fake signature
  const fakeSigToken = `${b64Data}.invalidsignature1234567890`;
  assert.strictEqual(await verifySessionToken(fakeSigToken), null, "Invalid signature must be rejected");

  // 2. Broken Function Level Authorization (BFLA) Tests on Admin Endpoints
  console.log("2. Testing Broken Function Level Authorization (BFLA)...");

  // A: update-status without token
  const unauthStatusReq = new Request("http://localhost:3000/api/admin/orders/update-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: "some-id", status: "PROCESSING" }),
  });
  const unauthStatusRes = await updateStatusHandler(unauthStatusReq);
  assert.strictEqual(unauthStatusRes.status, 401, "Unauthenticated status update must return 401");

  // B: settings update without token
  const unauthSettingsReq = new Request("http://localhost:3000/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enableTax: "true" }),
  });
  const unauthSettingsRes = await updateSettingsHandler(unauthSettingsReq);
  assert.strictEqual(unauthSettingsRes.status, 401, "Unauthenticated settings update must return 401");

  // C: shipping dispatch without token
  const unauthDispatchReq = new Request("http://localhost:3000/api/admin/shipping/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: "some-id" }),
  });
  const unauthDispatchRes = await dispatchHandler(unauthDispatchReq);
  assert.strictEqual(unauthDispatchRes.status, 401, "Unauthenticated dispatch must return 401");

  // 3. Status Value Allowlist Validation
  console.log("3. Testing Order Status Allowlist Validation...");
  const sampleOrder = await prisma.order.findFirst();
  assert(sampleOrder, "Sample order must exist");

  const illegalStatusReq = new Request("http://localhost:3000/api/admin/orders/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `sanvrit_admin_token=${validToken}`,
    },
    body: JSON.stringify({ orderId: sampleOrder.id, status: "MALICIOUS_DROP_TABLE" }),
  });
  const illegalStatusRes = await illegalStatusReqHandler(illegalStatusReq);
  assert.strictEqual(illegalStatusRes.status, 400, "Illegal order status must be rejected with 400");

  // 4. Settings Key Allowlist Validation
  console.log("4. Testing Settings Key Allowlist Validation...");
  const injectedSettingsReq = new Request("http://localhost:3000/api/admin/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `sanvrit_admin_token=${validToken}`,
    },
    body: JSON.stringify({
      enableTax: "false",
      maliciousKey: "exploit_value",
      __proto__: "polluted",
    }),
  });
  const injectedSettingsRes = await updateSettingsHandler(injectedSettingsReq);
  assert.strictEqual(injectedSettingsRes.status, 200, "Valid keys must be accepted");
  const badSettingInDb = await prisma.storeSetting.findUnique({ where: { key: "maliciousKey" } });
  assert.strictEqual(badSettingInDb, null, "Unallowlisted setting key must not be saved to DB");

  // 5. Checkout Input Validation (Phone, Pincode, Quantity limits)
  console.log("5. Testing Checkout Input Validation & Parameter Bounds...");
  const variant = await prisma.productVariant.findFirst();
  assert(variant, "Product variant must exist");

  // Invalid phone (e.g. 9 digits or non-Indian format)
  const badPhoneReq = new Request("http://localhost:3000/api/checkout/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: { name: "Test User", phone: "12345" },
      shippingAddress: { address: "123 Main St", pincode: "313001" },
      items: [{ variantId: variant.id, quantity: 1 }],
    }),
  });
  const badPhoneRes = await createOrderHandler(badPhoneReq);
  assert.strictEqual(badPhoneRes.status, 400, "Invalid phone must be rejected with 400");

  // Negative / Zero quantity
  const badQtyReq = new Request("http://localhost:3000/api/checkout/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: { name: "Test User", phone: "9876543210" },
      shippingAddress: { address: "123 Main St", pincode: "313001" },
      items: [{ variantId: variant.id, quantity: -2 }],
    }),
  });
  const badQtyRes = await createOrderHandler(badQtyReq);
  assert.strictEqual(badQtyRes.status, 400, "Negative quantity must be rejected with 400");

  // Excessive quantity
  const highQtyReq = new Request("http://localhost:3000/api/checkout/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: { name: "Test User", phone: "9876543210" },
      shippingAddress: { address: "123 Main St", pincode: "313001" },
      items: [{ variantId: variant.id, quantity: 999999 }],
    }),
  });
  const highQtyRes = await createOrderHandler(highQtyReq);
  assert.strictEqual(highQtyRes.status, 400, "Excessive quantity must be rejected with 400");

  // 6. Payment Idempotency & Stock Protection
  console.log("6. Testing Payment Idempotency & Double-Decrement Prevention...");
  // Create an order for testing payment
  const testOrderForPayment = await prisma.order.create({
    data: {
      orderNumber: `SANVRIT-SEC-${Date.now().toString().slice(-6)}`,
      customerName: "Security Test User",
      customerEmail: "sec@example.com",
      customerPhone: "9876543210",
      status: "PENDING_PAYMENT",
      subtotal: variant.price,
      totalAmount: variant.price,
      items: {
        create: [
          {
            productId: variant.productId,
            variantId: variant.id,
            title: "Test Ghee",
            variantTitle: variant.title,
            price: variant.price,
            quantity: 1,
            weightInGrams: variant.weightInGrams,
          },
        ],
      },
    },
  });

  const initialStock = (await prisma.productVariant.findUnique({ where: { id: variant.id } }))!.stockQuantity;

  // First payment verify (success)
  const verify1Req = new Request("http://localhost:3000/api/payment/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: testOrderForPayment.id,
      gatewayPaymentId: `pay_mock_${Date.now()}`,
    }),
  });
  const verify1Res = await verifyPaymentHandler(verify1Req);
  assert.strictEqual(verify1Res.status, 200, "First payment verify must succeed");

  const stockAfterFirst = (await prisma.productVariant.findUnique({ where: { id: variant.id } }))!.stockQuantity;
  assert.strictEqual(stockAfterFirst, initialStock - 1, "Stock must decrement by 1 on payment");

  // Duplicate payment verify (idempotent replay)
  const verify2Req = new Request("http://localhost:3000/api/payment/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: testOrderForPayment.id,
      gatewayPaymentId: `pay_mock_${Date.now()}`,
    }),
  });
  const verify2Res = await verifyPaymentHandler(verify2Req);
  assert.strictEqual(verify2Res.status, 200, "Duplicate payment verify must return 200 idempotent response");
  const data2 = await verify2Res.json();
  assert.strictEqual(data2.alreadyVerified, true, "Must flag alreadyVerified");

  const stockAfterSecond = (await prisma.productVariant.findUnique({ where: { id: variant.id } }))!.stockQuantity;
  assert.strictEqual(stockAfterSecond, stockAfterFirst, "Stock must NOT decrement a second time on replayed payment verification");

  console.log("✓ All Backend Security & API Correctness assertions passed successfully!");
}

async function illegalStatusReqHandler(req: Request) {
  return updateStatusHandler(req);
}

testBackendSecurity()
  .catch((err) => {
    console.error("Backend security test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
