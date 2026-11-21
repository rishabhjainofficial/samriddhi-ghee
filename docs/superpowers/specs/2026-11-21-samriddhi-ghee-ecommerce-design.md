# Design Document: Samriddhi Ghee E-Commerce Platform

**Date:** 2026-11-21  
**Project:** Samriddhi Ghee E-Commerce Storefront & Admin Portal  
**Status:** Complete & Ready for Approval  

---

## 1. Intent & The "Why"
Samriddhi Ghee is a direct-to-consumer (D2C) dairy brand launching with pure ghee (expandable to wider dairy products). The platform provides a fast, trustworthy customer storefront tailored to Indian consumer habits (emphasizing purity, traditional Bilona churning, transparent lab-tested claims, and friction-free guest ordering) along with a robust, back-office admin portal.

Because real payment gateway and logistics (Shiprocket) credentials will be added later, the architecture features clean service adapter boundaries (`MockPaymentProvider` and `MockShippingProvider`). This allows testing all end-to-end flows today and connecting live credentials later with zero rewrites.

---

## 2. Scope & Key Features

### Storefront (Customer-Facing)
1. **Home Page (`/`):**
   - High-impact Hero: "Pure Desi Gir Cow Ghee - Made with Traditional Vedic Bilona Method".
   - Trust Highlights: 100% Pure & Unadulterated, Grass-Fed A2 Cows, Glass Jar Packaging, Lab Tested.
   - Featured Products with direct size/variant selection and quick "Add to Cart".
   - "How We Make It" educational story (Milk -> Curd -> Hand Churned Makkhan -> Slow Fire Ghee).
   - Customer Reviews & Ratings.
   - Floating WhatsApp Support button (essential for Indian D2C customer trust).
2. **Product Listing & Detail Pages (`/products`, `/products/[slug]`):**
   - High-res image gallery with zoom/slide.
   - Variant picker (e.g., 250ml Jar, 500ml Jar, 1 Litre Tin, Pack of 2).
   - Dynamic price, MRP compare-at price, and savings badge ("Save 15%").
   - Live stock indicator ("In Stock" / "Only 3 left").
   - Nutritional facts, ayurvedic benefits, and storage guidelines.
3. **Cart Drawer & Page (`/cart`):**
   - Slide-over drawer accessible from any page.
   - Item quantity controls, unit price, and variant indicators.
   - Free shipping progress bar (e.g. *"Add ₹250 more to unlock FREE Delivery!"*).
   - Order note / special delivery instructions field.
4. **Checkout Page (`/checkout`):**
   - 100% Guest-friendly: No password required.
   - Customer Contact: Full Name, 10-digit Mobile Number, Email Address.
   - Delivery Address: House/Flat/Street, Landmark/Area, 6-digit PIN code, City, State.
   - Auto-population of City & State upon entering a valid 6-digit Indian PIN code.
   - Order summary breakdown (Subtotal, Flat Shipping / Free Shipping, Total Payable).
5. **Payment Page (`/payment/[orderId]`):**
   - Prepaid-only order processing.
   - Simulated Gateway Interface with tabs for UPI, Cards, and Net Banking.
   - Test mode triggers: "Simulate Success" and "Simulate Failure" to verify order state changes.
   - Ready for Razorpay/Cashfree drop-in.
6. **Thank You & Confirmation Page (`/order-success/[orderId]`):**
   - Confirmed order badge with unique Order Number (e.g., `SG-2026-1042`).
   - Complete itemized receipt and delivery address summary.
   - Estimated delivery timeline (3-5 business days).
   - Direct button to track shipment.
7. **Order Tracking Page (`/track`):**
   - Public lookup page where customers enter their **Order Number** and **Mobile Number** to check live delivery milestones (Confirmed -> Processing -> Dispatched -> Out for Delivery -> Delivered).

---

### Admin Portal (`/admin`)

Protected via admin session authentication (credentials configured in `.env` / database).

1. **Dashboard (`/admin`):**
   - High-level KPIs: Total Revenue, Total Orders, Average Order Value (AOV), Pending Dispatches, Low Stock Alerts.
   - Revenue & Orders mini-chart.
   - Recent Orders table with real-time status badges.
2. **Order Master (`/admin/orders`):**
   - Filterable data table by status: `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
   - Search by Order #, Customer Name, or Phone.
   - Order detail drawer with customer info, delivery address, ordered variants, and printable invoice slip.
   - Status transition controls and "Dispatch with Courier" trigger.
3. **Product Master (`/admin/products`):**
   - Product list with thumbnail, category, variant count, and active status toggle.
   - Product Editor (Create & Edit):
     - Title, slug, description, benefits, ingredients, and category.
     - Image manager supporting both file upload (saved to public storage) and image URLs.
     - Variants Manager: Add/remove variants per product (Title e.g. "500ml Glass Jar", SKU, Price, MRP, Stock Quantity, Dead Weight in grams, Package Dimensions $L \times B \times H$ in cm, Active toggle).
4. **Payment Detail Master (`/admin/payments`):**
   - Ledger of all transactions.
   - Fields: Transaction ID, Order Reference, Customer Name, Amount, Gateway Provider (`MOCK` vs `RAZORPAY`), Payment Method (`UPI`, `CARD`), Status (`SUCCESS`, `FAILED`), Timestamp.
   - View raw payload modal for auditing and troubleshooting.
5. **Shipping Master (`/admin/shipping`):**
   - Queue of `PAID` orders awaiting fulfillment.
   - Packaging Calculator: Automatically calculates total dead weight (sum of variant weights) and selects suggested box tier (Small / Medium / Large box presets), with admin override for custom dimensions.
   - "Generate AWB / Dispatch" button calling the Shipping Service.
   - AWB Number, assigned courier partner (e.g., Delhivery Surface), printable shipping label preview, and live tracking status updater.

---

## 3. Core Business Rules & Built-In Decisions

1. **Fully Optional Taxes (GST):**
   - **Taxes are completely optional and disabled by default.**
   - If tax calculation is turned OFF (`enableTax = false`), no tax calculations, fields, or percentages are applied to orders, and `taxAmount = 0`.
   - If the client decides to enable taxes later, they can turn ON `enableTax` in settings and specify the percentage (e.g. 5% or 12%) and whether it is inclusive or exclusive.
2. **Fully Optional Shipping Charges:**
   - **Shipping fees are completely optional and default to FREE (₹0).**
   - In Store Settings, the admin can set `enableShippingFee = false` (All deliveries are 100% FREE everywhere).
   - If enabled in the future, the admin can configure:
     - `flatShippingFee`: e.g. ₹50 or ₹70
     - `freeShippingThreshold`: e.g. Free shipping above ₹999
   - When disabled or ₹0, the checkout and order receipts cleanly show `Shipping: FREE`.
3. **Inventory Deduction Lifecycle:**
   - Stock is only decremented upon confirmed payment (`PAID`).
   - If an order is abandoned at `PENDING_PAYMENT`, stock is never held or locked, avoiding false out-of-stock scenarios.
4. **Shiprocket & Packaging Integration:**
   - Dead weight (grams) and box dimensions ($L \times B \times H$ cm) are stored on every product variant.
   - Multi-item orders aggregate total weight, and the Shipping Master defaults to preset standard courier boxes (Box S: $15\times15\times15$, Box M: $22\times18\times15$, Box L: $30\times25\times20$ cm) which the admin can confirm or adjust before dispatching.
5. **COD & Future Payment Options:**
   - Prepaid only for v1 as requested. A global setting `isCodEnabled` is stored so COD can be toggled on with a single click if desired later.

---

## 4. Technical Architecture

- **Framework:** Next.js 15 (App Router, Server Actions, Route Handlers)
- **Language & Styling:** TypeScript, Tailwind CSS, Lucide React icons
- **Database & ORM:** Prisma ORM with SQLite for instant local zero-dependency development (ready for PostgreSQL via `DATABASE_URL`)
- **State Management:** Zustand / React Context for cart state with `localStorage` persistence
- **Security:** HTTP-only secure cookie for admin authentication session; input sanitization on all checkout endpoints

---

### 4.5 UI/UX Design System Specification (via ui-ux-pro-max)

Guided by the **ui-ux-pro-max** design intelligence engine for clean, lightweight, high-conversion e-commerce:

1. **Aesthetic Direction: Modern Artisanal & Swiss Minimalist**
   - Clean, airy layout with generous breathing room (`padding: 2rem+`, `gap: 1.5rem–2rem`).
   - Replaces heavy gradients with subtle featherweight borders (`border-stone-200`) and soft card elevations.
   - Purity and authenticity conveyed through crisp photography, typography, and warm golden undertones.

2. **Color Palette (Golden Amber & Warm Cream):**
   - **Primary / Ghee Gold:** `#D97706` (`amber-600`) / `#B45309` (`amber-700` hover) — warm, appetizing pure butterfat tone.
   - **Organic Accent:** `#059669` (`emerald-600`) — subtle purity, Vedic herbs, grass-fed origin badges.
   - **Storefront Background:** `#FDFBF7` (Warm ivory / light butter cream) — eliminates harsh blue-white glare while feeling clean.
   - **Card / Surface:** `#FFFFFF` with hairline `border-stone-200` and `shadow-sm`.
   - **Typography / Foreground:** `#1C1917` (`stone-900`) for headings (ultra-high contrast 12:1 against cream), `#44403C` (`stone-700`) for body copy, `#78716C` (`stone-500`) for secondary metadata.

3. **Typography Hierarchy:**
   - **Headings:** Modern, welcoming geometric sans (`Outfit` or `Rubik`), high line-balance (`text-wrap: balance`).
   - **Body & Numerical Data:** High-legibility geometric sans (`Inter` / `Nunito Sans`), tabular numbers (`font-mono` / `tabular-nums`) for prices, weights, and order numbers.

4. **Micro-Interactions & Performance:**
   - Super lightweight: Pure SVG icons via **Lucide React** (no heavy icon sets or emoji).
   - Instant response transitions: `duration-150 ease-out` on buttons, cart counters, and input focus rings.
   - Strict touch accessibility: All buttons, quantity counters, and selectors enforce $\ge 44 \times 44\text{px}$ touch targets on mobile.
   - Zero Cumulative Layout Shift (CLS): Explicit image aspect-ratio reservations (`aspect-square` / `aspect-[4/5]`) with skeleton shimmer loaders.

---

### Pluggable Adapters:

```typescript
// Payment Gateway Interface
export interface IPaymentGateway {
  createPaymentOrder(params: {
    orderId: string;
    amountInPaise: number;
    currency: string;
    customer: { name: string; email: string; phone: string };
  }): Promise<{ gatewayOrderId: string; checkoutUrl?: string }>;

  verifyPayment(params: {
    orderId: string;
    gatewayPaymentId: string;
    gatewaySignature?: string;
  }): Promise<{ isSuccessful: boolean; transactionId: string; rawResponse: any }>;
}

// Logistics & Shipping Interface (Shiprocket Ready)
export interface IShippingProvider {
  createShipment(params: {
    orderId: string;
    orderItems: Array<{ name: string; sku: string; qty: number; price: number }>;
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      landmark?: string;
      city: string;
      state: string;
      pincode: string;
    };
    totalWeightInGrams: number;
    dimensions: { lengthCm: number; breadthCm: number; heightCm: number };
  }): Promise<{
    shipmentId: string;
    awbCode: string;
    courierName: string;
    labelUrl?: string;
  }>;

  trackShipment(awbCode: string): Promise<{
    currentStatus: string;
    statusTimeline: Array<{ stage: string; timestamp: string; location: string }>;
  }>;
}
```

---

## 5. Database Schema (Prisma)

- `AdminUser`: `id`, `email`, `passwordHash`, `name`, `role`, `createdAt`
- `Category`: `id`, `name`, `slug`, `description`
- `Product`: `id`, `title`, `slug`, `description`, `benefits`, `ingredients`, `images` (JSON array of strings), `categoryId`, `isActive`, `createdAt`, `updatedAt`
- `ProductVariant`: `id`, `productId`, `title`, `sku`, `price`, `mrp`, `stockQuantity`, `weightInGrams`, `lengthCm`, `breadthCm`, `heightCm`, `isActive`
- `Order`: `id`, `orderNumber`, `customerName`, `customerEmail`, `customerPhone`, `status` (`PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), `subtotal`, `shippingFee` (default 0), `taxAmount` (default 0, optional), `totalAmount`, `notes`, `shippingAddressId`, `createdAt`, `updatedAt`
- `OrderItem`: `id`, `orderId`, `productId`, `variantId`, `title`, `variantTitle`, `price`, `quantity`, `weightInGrams`
- `ShippingAddress`: `id`, `orderId`, `recipientName`, `phone`, `addressLine1`, `addressLine2`, `landmark`, `city`, `state`, `pincode`
- `PaymentTransaction`: `id`, `orderId`, `gatewayProvider`, `gatewayPaymentId`, `amount`, `status` (`SUCCESS`, `FAILED`, `PENDING`), `method`, `rawPayload`, `createdAt`
- `Shipment`: `id`, `orderId`, `provider`, `shipmentId`, `awbCode`, `courierName`, `status` (`MANIFESTED`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`), `labelUrl`, `lengthCm`, `breadthCm`, `heightCm`, `weightInGrams`, `trackingData` (JSON), `createdAt`, `updatedAt`
- `StoreSetting`: `id`, `key`, `value` (e.g., `enableTax=false`, `taxRate=0`, `enableShippingFee=false`, `flatShippingRate=0`, `freeShippingThreshold=0`, `isCodEnabled=false`, `supportPhone`)
