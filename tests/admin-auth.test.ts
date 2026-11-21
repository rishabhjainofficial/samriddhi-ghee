import assert from "node:assert";
import { authenticateAdmin, createSessionToken, verifySessionToken } from "../src/lib/auth";

async function testAdminAuth() {
  console.log("Testing Admin Authentication & Session Security...");

  // 1. Valid Admin Login
  const authSuccess = await authenticateAdmin("admin@sanvritghee.com", "AdminPassword@123");
  assert(authSuccess, "Valid admin credentials must authenticate successfully");
  assert.strictEqual(authSuccess.email, "admin@sanvritghee.com");
  assert.strictEqual(authSuccess.role, "ADMIN");

  // 2. Invalid Password
  const authWrongPass = await authenticateAdmin("admin@sanvritghee.com", "WrongPassword123");
  assert.strictEqual(authWrongPass, null, "Invalid password must return null");

  // 3. Unknown Email
  const authUnknown = await authenticateAdmin("unknown@example.com", "AnyPassword");
  assert.strictEqual(authUnknown, null, "Unknown admin email must return null");

  // 4. Session Token Signing & Verification
  const token = await createSessionToken({
    id: authSuccess.id,
    email: authSuccess.email,
    name: authSuccess.name,
    role: authSuccess.role,
  });
  assert(token.length > 20, "Session token must be non-empty string");

  const verified = await verifySessionToken(token);
  assert(verified, "Valid token must verify successfully");
  assert.strictEqual(verified.email, "admin@sanvritghee.com");

  // 5. Tampered token
  const tampered = await verifySessionToken(`${token}_tampered`);
  assert.strictEqual(tampered, null, "Tampered token must fail verification");

  console.log("✓ Admin Authentication & Session Security verified successfully!");
}

testAdminAuth().catch((err) => {
  console.error("Admin auth test failed:", err);
  process.exit(1);
});
