# Samriddhi Ghee E-Commerce Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, lightweight, direct-to-consumer e-commerce platform for Samriddhi Ghee featuring a guest-first customer storefront and an operational admin portal, backed by pluggable mock payment and Shiprocket logistics adapters.

**Architecture:** Next.js 15 App Router monolith with TypeScript, Tailwind CSS (styled with UI/UX Pro Max guidelines for modern artisanal dairy), Prisma ORM with SQLite, and decoupled service interfaces for payment gateways and courier logistics.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, SQLite, Lucide React, Zustand.

**Spec:** [`docs/superpowers/specs/2026-11-21-samriddhi-ghee-ecommerce-design.md`](file:///Volumes/Rish%20SSD/projects/freelance/samriddhi-ghee/docs/superpowers/specs/2026-11-21-samriddhi-ghee-ecommerce-design.md)

---

## Global Constraints

- All customer checkouts must be 100% guest-friendly (no passwords required; mobile number, email, and shipping address only).
- All taxes and shipping fees must be completely optional and default to disabled (₹0 / FREE delivery).
- Business logic must never directly couple to external SDKs; all payment and shipping operations must go through `IPaymentGateway` and `IShippingProvider` interfaces.
- Product variants must store dead weight (grams) and package dimensions ($L \times B \times H$ in cm) for Shiprocket logistics readiness.
- UI must follow UI/UX Pro Max guidelines: clean, lightweight, minimum 44px touch targets on mobile, warm golden amber `#D97706` and cream palette, zero emojis as icons (use Lucide SVG).

---

## Review Focus

1. **Variant Out-of-Stock during Payment:** If stock drops to 0 between cart addition and payment verification, the payment callback must prevent negative inventory and flag the order as needing resolution/refund.
2. **Multi-Item Packaging for Logistics:** When an order contains multiple jars/tins, total dead weight must be the sum of item weights and outer dimensions must use selected box tier presets without breaking courier constraints.
3. **Pincode Lookup Resiliency:** If the 6-digit Indian PIN code lookup fails or is unavailable, manual entry of City and State must remain fully functional.
4. **Zero-Charge / Disabled Settings:** When taxes and shipping charges are disabled in Store Settings, the checkout must compute $Total = Subtotal$ exactly without rounding errors or empty fee lines.
5. **Guest Order Retrieval Security:** The public tracking route (`/track`) must require matching both `orderNumber` AND `customerPhone` to view order details.

---

## Task Structure

### Task 1: Next.js Foundation, Tailwind UI & Prisma Database Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/prisma.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: None (root foundation)
- Produces: `prisma` client instance, Prisma models (`AdminUser`, `Category`, `Product`, `ProductVariant`, `Order`, `OrderItem`, `ShippingAddress`, `PaymentTransaction`, `Shipment`, `StoreSetting`).

- [ ] **Step 1: Write failing database test**
  In `tests/db.test.ts`, assert querying `prisma.product.findMany({ include: { variants: true } })` returns seeded products with variants, and `prisma.storeSetting.findMany()` returns default settings with `enableTax=false` and `enableShippingFee=false`.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/db.test.ts`
  Expected: FAIL (Cannot find module `src/lib/prisma`).
- [ ] **Step 3: Initialize Next.js, Tailwind, Prisma schema, and Seed script**
  Configure Next.js 15 App Router, Tailwind with warm cream & golden amber palette (`#D97706`), Prisma schema with all 10 entities, and seed with Samriddhi Ghee catalog (A2 Desi Cow Bilona Ghee with 250ml, 500ml, 1L variants, Buffalo Ghee, initial admin account, default store settings).
- [ ] **Step 4: Run migration and test to verify it passes**
  Run: `npx prisma db push && npx tsx prisma/seed.ts && npx tsx tests/db.test.ts`
  Expected: PASS (Seeded products and store settings verified).
- [ ] **Step 5: Commit**
  Run: `git add . && git commit -m "feat: setup Next.js 15, Prisma schema, and seed catalog"`

---

### Task 2: Pluggable Service Adapters (Payment & Shipping)

**Files:**
- Create: `src/lib/services/payment/types.ts`
- Create: `src/lib/services/payment/mock-payment.ts`
- Create: `src/lib/services/payment/index.ts`
- Create: `src/lib/services/shipping/types.ts`
- Create: `src/lib/services/shipping/mock-shipping.ts`
- Create: `src/lib/services/shipping/index.ts`
- Test: `tests/adapters.test.ts`

**Interfaces:**
- Consumes: Prisma types
- Produces: `getPaymentGateway(): IPaymentGateway`, `getShippingProvider(): IShippingProvider`.

- [ ] **Step 1: Write failing adapter tests**
  In `tests/adapters.test.ts`, test that `getPaymentGateway().createPaymentOrder()` returns mock gateway order ID and `verifyPayment()` returns success status; test `getShippingProvider().createShipment()` returns an AWB code and `trackShipment()` returns tracking milestone timeline.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/adapters.test.ts`
  Expected: FAIL with "Cannot find module `src/lib/services/payment`".
- [ ] **Step 3: Implement IPaymentGateway & IShippingProvider with Mock Implementations**
  Implement `MockPaymentGateway` with deterministic order simulation and `MockShippingProvider` with box preset sizing (Small, Medium, Large) and realistic tracking stages (`MANIFESTED`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`).
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/adapters.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/lib/services tests/adapters.test.ts && git commit -m "feat: implement pluggable mock payment and shipping adapters"`

---

### Task 3: Cart Store, Pricing & Optional Charge Engine

**Files:**
- Create: `src/lib/store/cart.ts`
- Create: `src/lib/utils/pricing.ts`
- Create: `src/lib/utils/pincode.ts`
- Test: `tests/cart-pricing.test.ts`

**Interfaces:**
- Consumes: Product & Variant types, StoreSettings
- Produces: `useCartStore` hook, `calculateOrderTotals(subtotal, settings)`, `lookupPincode(pincode)`.

- [ ] **Step 1: Write failing cart & pricing test**
  In `tests/cart-pricing.test.ts`:
  - Test `calculateOrderTotals()` when `enableTax=false` and `enableShippingFee=false` produces `shippingFee=0`, `taxAmount=0`, and `total=subtotal`.
  - Test when `enableShippingFee=true` and `subtotal < threshold` adds flat fee; when `>= threshold` sets fee to 0.
  - Test `lookupPincode("110001")` returns `{ city: "New Delhi", state: "Delhi" }`.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/cart-pricing.test.ts`
  Expected: FAIL with module not found.
- [ ] **Step 3: Implement Cart Zustand store, pricing calculator, and Pincode directory**
  Implement `useCartStore` with localStorage persistence, cart drawer open/close state, line items with variant SKU, quantity increment/decrement, and pincode lookup dataset for major Indian PIN codes.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/cart-pricing.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/lib/store src/lib/utils tests/cart-pricing.test.ts && git commit -m "feat: implement cart store, pricing engine, and pincode helper"`

---

### Task 4: Storefront UI (Home, Catalog, Detail & Cart Drawer)

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/WhatsAppButton.tsx`
- Create: `src/components/cart/CartDrawer.tsx`
- Create: `src/components/products/VariantSelector.tsx`, `src/components/products/ProductCard.tsx`
- Create: `src/app/page.tsx`, `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`
- Test: `tests/storefront.test.ts`

**Interfaces:**
- Consumes: `prisma.product`, `useCartStore`
- Produces: Customer storefront pages and interactive product purchase components.

- [ ] **Step 1: Write storefront render test**
  In `tests/storefront.test.ts`, assert Home page, Product Listing, and Product Detail components render product titles, variant prices, and purity trust badges.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/storefront.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Storefront UI with UI/UX Pro Max standards**
  - Navbar with Samriddhi Ghee branding, catalog links, and Cart button with badge count.
  - Hero section, Bilona process timeline, and Purity Badges (100% Desi Cow, Grass-fed, Zero Preservatives).
  - Product Listing & Detail pages with high-res jar visuals, variant selector (250ml, 500ml, 1L), savings calculation, nutritional facts, and "Add to Cart" interaction.
  - Slide-over Cart Drawer with free shipping progress bar, quantity controls, and "Proceed to Checkout" CTA.
  - Floating WhatsApp support button.
- [ ] **Step 4: Run test and Next build check to verify it passes**
  Run: `npx tsx tests/storefront.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/components src/app tests/storefront.test.ts && git commit -m "feat: build customer storefront, catalog, and cart drawer"`

---

### Task 5: Guest Checkout, Payment Simulator & Order Confirmation

**Files:**
- Create: `src/app/checkout/page.tsx`, `src/app/checkout/CheckoutForm.tsx`
- Create: `src/app/api/checkout/create-order/route.ts`
- Create: `src/app/payment/[orderId]/page.tsx`, `src/app/payment/[orderId]/PaymentSimulator.tsx`
- Create: `src/app/api/payment/verify/route.ts`
- Create: `src/app/order-success/[orderId]/page.tsx`
- Create: `src/app/track/page.tsx`
- Test: `tests/checkout-e2e.test.ts`

**Interfaces:**
- Consumes: `useCartStore`, `getPaymentGateway`, `prisma.order`
- Produces: Guest checkout flow, mock payment execution, order confirmation, and public tracking lookup.

- [ ] **Step 1: Write failing e2e checkout flow test**
  In `tests/checkout-e2e.test.ts`, simulate creating an order with guest address, verify order status is `PENDING_PAYMENT`, simulate payment success, assert status updates to `PAID`, transaction is logged, and variant inventory is decremented.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/checkout-e2e.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Checkout, Payment Simulation, Success & Tracking pages**
  - Checkout form: Name, 10-digit Phone, Email, Address, Landmark, 6-digit Pincode with auto-city/state lookup.
  - Order creation endpoint: Validates cart items and prices, checks stock, creates `Order`, `OrderItem`, and `ShippingAddress` with `PENDING_PAYMENT`.
  - Payment page: Mock UPI/Card/NetBanking simulator with "Simulate Success" and "Simulate Failure" buttons.
  - Verification route: Validates payment via `IPaymentGateway`, updates `Order` to `PAID`, logs `PaymentTransaction`, decrements variant stock in a database transaction.
  - Thank You page: Displays Order #, breakdown, delivery address, estimated delivery, and tracking link.
  - Public Tracking (`/track`): Look up order by Order # and Phone, showing live delivery timeline.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/checkout-e2e.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/app/checkout src/app/payment src/app/order-success src/app/track src/app/api tests/checkout-e2e.test.ts && git commit -m "feat: implement guest checkout, payment simulator, and order tracking"`

---

### Task 6: Admin Authentication & Layout

**Files:**
- Create: `src/lib/auth.ts`, `src/middleware.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`, `src/components/admin/AdminSidebar.tsx`
- Test: `tests/admin-auth.test.ts`

**Interfaces:**
- Consumes: `prisma.adminUser`
- Produces: Protected `/admin` layout, session verification, admin login and logout actions.

- [ ] **Step 1: Write admin authentication test**
  In `tests/admin-auth.test.ts`, test verifying correct admin password returns session token; invalid password fails; verifying session token authenticates user.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/admin-auth.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Admin Auth, Middleware & Admin Shell**
  - Implement password hashing verification (bcrypt/scrypt) and secure HTTP-only cookie session handling.
  - Middleware protecting all `/admin/*` routes (redirects to `/admin/login` if not authenticated).
  - Modern Admin Sidebar with links to Dashboard, Orders, Products, Payments, Shipping, Settings, and Logout button.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/admin-auth.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/lib/auth.ts src/middleware.ts src/app/admin tests/admin-auth.test.ts && git commit -m "feat: implement admin authentication and layout"`

---

### Task 7: Admin Dashboard & Order Master

**Files:**
- Create: `src/app/admin/page.tsx` (Dashboard)
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/components/admin/OrderDetailDrawer.tsx`, `src/components/admin/PrintInvoice.tsx`
- Test: `tests/admin-orders.test.ts`

**Interfaces:**
- Consumes: `prisma.order`, `prisma.orderItem`
- Produces: Admin Dashboard metrics and complete Order Master interface.

- [ ] **Step 1: Write dashboard & order master test**
  In `tests/admin-orders.test.ts`, test calculating revenue, order count, pending shipments, and filtering orders by status (`PAID`, `PROCESSING`, `SHIPPED`).
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/admin-orders.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Dashboard metrics & Order Master UI**
  - Dashboard KPIs: Total Revenue, Total Orders, Average Order Value (AOV), Pending Shipments, Low Stock variant warning.
  - Order Master: Filterable table with status pills, customer phone, total amount, and actions.
  - Order Details Drawer: Itemized breakdown, customer delivery address, order status updater (`PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`), and printable invoice preview.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/admin-orders.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/app/admin/page.tsx src/app/admin/orders src/components/admin tests/admin-orders.test.ts && git commit -m "feat: build admin dashboard and order master"`

---

### Task 8: Admin Product Master & Variant Management

**Files:**
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/products/new/page.tsx`, `src/app/admin/products/[id]/page.tsx`
- Create: `src/components/admin/ProductForm.tsx`, `src/components/admin/VariantManager.tsx`
- Create: `src/app/api/admin/products/route.ts`, `src/app/api/upload/route.ts`
- Test: `tests/admin-products.test.ts`

**Interfaces:**
- Consumes: `prisma.product`, `prisma.productVariant`
- Produces: Full Product & Variant CRUD operations, local image upload handler.

- [ ] **Step 1: Write product & variant management test**
  In `tests/admin-products.test.ts`, test creating a new product with multiple variants (price, SKU, weight in grams, dimensions), updating stock, and archiving a product.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/admin-products.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Product Master & Variant Manager UI**
  - Product List table with thumbnail, title, category, variant count, stock sum, and active toggle.
  - Product Form: Title, slug auto-generation, description, benefits, ingredients, category selector.
  - Image Manager: Drag-and-drop local file upload endpoint (saves to `public/uploads`) plus direct image URL input.
  - Variants Table: Add/remove variants per product (Title e.g. "500ml Jar", SKU, Price, MRP, Stock, Dead Weight in grams, Length/Breadth/Height in cm).
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/admin-products.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/app/admin/products src/app/api/admin/products src/app/api/upload tests/admin-products.test.ts && git commit -m "feat: build product master and variant manager"`

---

### Task 9: Admin Shipping Master & Payment Detail Master

**Files:**
- Create: `src/app/admin/payments/page.tsx`
- Create: `src/app/admin/shipping/page.tsx`
- Create: `src/components/admin/DispatchModal.tsx`, `src/components/admin/ShippingLabel.tsx`
- Create: `src/app/api/admin/shipping/dispatch/route.ts`
- Test: `tests/admin-shipping-payments.test.ts`

**Interfaces:**
- Consumes: `getShippingProvider`, `prisma.paymentTransaction`, `prisma.shipment`
- Produces: Payment reconciliation ledger and shipment fulfillment with AWB generation.

- [ ] **Step 1: Write shipping fulfillment & payment ledger test**
  In `tests/admin-shipping-payments.test.ts`, test querying orders ready for shipping, selecting box preset (Small/Medium/Large), aggregating weights, generating mock AWB and label, and querying payment transactions.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/admin-shipping-payments.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Shipping Master & Payment Detail Master UI**
  - Payment Detail Master: Ledger of all transaction attempts, payment method pills, status (`SUCCESS`, `FAILED`), and modal to inspect raw gateway payloads.
  - Shipping Master: Table of `PAID` orders awaiting dispatch.
  - Dispatch Modal: Auto-aggregates total weight from ordered variants, selects suggested box tier (Box S: $15\times15\times15\text{cm}$, Box M: $22\times18\times15\text{cm}$, Box L: $30\times25\times20\text{cm}$) with override capability.
  - "Generate AWB" action calling `IShippingProvider.createShipment()`, creating `Shipment` record, updating order status to `SHIPPED`, and displaying printable courier shipping label.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/admin-shipping-payments.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/app/admin/payments src/app/admin/shipping src/app/api/admin/shipping tests/admin-shipping-payments.test.ts && git commit -m "feat: build shipping master and payment detail master"`

---

### Task 10: Store Settings (Optional Taxes, Shipping, COD & Support)

**Files:**
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/app/api/admin/settings/route.ts`
- Modify: `src/lib/utils/pricing.ts` (consumes dynamic settings)
- Test: `tests/admin-settings.test.ts`

**Interfaces:**
- Consumes: `prisma.storeSetting`
- Produces: Dynamic store settings manager and reactive pricing calculation.

- [ ] **Step 1: Write store settings configuration test**
  In `tests/admin-settings.test.ts`, test updating `enableTax=true` and `taxRate=5` makes `calculateOrderTotals()` add 5% tax; turning it off sets tax to 0. Test updating shipping fee settings.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/admin-settings.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Store Settings UI & API**
  - Toggle and percentage input for Taxes (Default: OFF / 0%).
  - Toggle and fee inputs for Shipping (Default: OFF / ₹0 Free Delivery).
  - Toggle for Cash on Delivery (COD).
  - WhatsApp support number and store contact email.
- [ ] **Step 4: Run test and full build verification**
  Run: `npx tsx tests/admin-settings.test.ts && npm run build`
  Expected: PASS (Next.js build succeeds with zero type or lint errors).
- [ ] **Step 5: Commit**
  Run: `git add src/app/admin/settings src/lib/utils/pricing.ts tests/admin-settings.test.ts && git commit -m "feat: implement store settings for optional taxes and shipping"`
