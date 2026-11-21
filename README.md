# Sanvrit Ghee — Taste of Purity 🧈🌿

> **Production-grade Direct-to-Consumer (D2C) e-commerce platform for handcrafted Vedic Bilona A2 Desi Cow Ghee.**  
> Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Prisma ORM (SQLite / PostgreSQL ready), Zustand, and Lucide Icons.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Storefront & Customer Experience](#storefront--customer-experience)
  - [Cart & Dynamic Pricing Engine](#cart--dynamic-pricing-engine)
  - [Guest Checkout & Payment Gateway](#guest-checkout--payment-gateway)
  - [Order Tracking & Customer Account](#order-tracking--customer-account)
  - [Admin Operations Console](#admin-operations-console)
  - [SEO & Rich Schema Structured Data](#seo--rich-schema-structured-data)
- [Tech Stack](#-tech-stack)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Environment Setup](#installation--environment-setup)
  - [Database Setup & Seeding](#database-setup--seeding)
  - [Running the Application](#running-the-application)
- [Automated Test Suite](#-automated-test-suite)
- [Payment & Shipping Integration](#-payment--shipping-integration)
- [Admin Credentials](#-admin-credentials)
- [License](#-license)

---

## 🌟 Overview

**Sanvrit Ghee** is an artisanal dairy e-commerce application crafted for **Dharmasya Food Products Pvt. Ltd.** (Udaipur, Rajasthan). It honors the sacred 5-step Vedic Bilona tradition—hand-milking free-grazing indigenous Gir cows, culturing whole milk into curd, bi-directional wooden churning before dawn, separating makkhan, and slow cow-dung firewood simmering into golden granular (*danedaar*) ghee.

The application delivers an ultra-fast, zero-friction buying experience optimized for mobile, tablet, and desktop viewports, backed by an operational control tower for order fulfillment and logistics.

---

## ✨ Key Features

### Storefront & Customer Experience
- **Vedic Bilona Storytelling**: Step-by-step visual narrative detailing ancient curd-churning wisdom vs. industrial cream boiling.
- **Optimized Packaging Imagery**: High-fidelity `.webp` packaging photos (Front and Nutritional/Label views) displayed via Next.js `<Image>` with zero cropping (`object-contain`) and instant thumbnail switching.
- **Live Variant Selection**:
  - **1,000 ml (1 Litre) Glass Jar**: ₹1,200 (MRP ₹1,500 — Save 20%)
  - **5,000 ml (5 Litre) Family Container**: ₹5,500 (MRP ₹6,500 — Save 15%)
- **Trust & Compliance Signals**: Lab Certified badge, FSSAI License Number (`22225088000714`), manufacturer origin, batch freshness, and 1-click WhatsApp customer support.

### Cart & Dynamic Pricing Engine
- **Persistent Flyout Cart**: Slide-over drawer powered by Zustand with `localStorage` persistence.
- **Real-Time Threshold Free Shipping**:
  - Standard Flat Delivery: ₹99
  - Free Shipping unlocked automatically for orders over ₹1,500.
- **Pincode Delivery Estimator**: Instant client-side lookup for delivery feasibility and estimated transit timelines across Indian postal zones.

### Guest Checkout & Payment Gateway
- **Zero-Barrier Checkout**: No forced account creation or password friction—just essential shipping and contact details.
- **Pincode Autofill**: Instant auto-population of City and State upon entering a 6-digit Indian PIN code.
- **Adaptive Payment Integration**:
  - Built-in **Payment Simulator** for instant developer testing and sandbox demonstrations.
  - Modular adapter pattern ready for production **Razorpay**, **Cashfree**, and **UPI** gateways.

### Order Tracking & Customer Account
- **Live Order Tracking (`/track`)**: Customers can track parcel dispatch, carrier AWB, and delivery milestones using either their Order Number (`SG-YYYY-XXXX`) or registered Phone Number.
- **Order History Lookup (`/account`)**: OTP/Phone lookup for returning customers to view past purchases, invoices, and reorder items.

### Admin Operations Console (`/admin`)
- **Secure Authentication**: Cookie-based HTTP-only session tokens with `bcryptjs` password hashing and Next.js middleware route protection.
- **Real-Time KPIs**: Gross revenue, total orders placed, average order value (AOV), and pending fulfillment counts.
- **Order Management Master**: Filter by status (`PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **One-Click Logistics Dispatch**: Assign carrier, weight, dimensions, and generate tracking URLs directly from the order drawer.
- **Catalog Management**: Add/edit products, adjust variant pricing, update stock levels, and toggle SKU visibility.
- **Store Settings & Audit**: Configurable shipping fees, free shipping thresholds, tax rates, and support coordinates.

### SEO & Rich Schema Structured Data
- **Dynamic XML Sitemap (`/sitemap.xml`)**: Automatically indexes all database products and storefront routes with priority rankings.
- **Robots Directive (`/robots.txt`)**: Allows search engines while shielding admin, payment, and internal API routes.
- **Schema.org JSON-LD**:
  - `Organization` & `LocalBusiness` / `Store` with address, Udaipur origin, and FSSAI registration.
  - `Product` with `AggregateOffer` (lowPrice ₹1,200, highPrice ₹5,500, INR currency, and `InStock` availability for Google Rich Snippets).
- **OpenGraph & Twitter Cards**: High-res preview cards for WhatsApp, Twitter/X, and social sharing.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions, Route Handlers) |
| **Frontend Library** | React 19, TypeScript |
| **Styling** | Tailwind CSS v3, Tailwind Merge, CLSX |
| **Icons** | Lucide React |
| **Database & ORM** | SQLite (`prisma/dev.db`) via Prisma ORM 6 (seamlessly switchable to PostgreSQL) |
| **State Management** | Zustand (persistent client cart) |
| **Auth & Security** | HTTP-only Cookies, JWT/Session tokens, Bcryptjs |
| **Image Optimization** | Next.js Image Optimization with `.webp` & `.avif` pipeline |
| **Testing** | Node TSX test runner |

---

## 📂 Architecture & Directory Structure

```text
samriddhi-ghee/
├── prisma/
│   ├── schema.prisma        # Database models (AdminUser, Product, Variant, Order, etc.)
│   ├── seed.ts              # Idempotent seed script (admin user & product variants)
│   └── dev.db               # Local SQLite database
├── public/
│   └── images/              # Optimized .webp assets (hero, jars, logo, icons)
├── src/
│   ├── app/
│   │   ├── (storefront)/    # Public customer pages
│   │   │   ├── page.tsx     # Homepage (Hero, Trust Badges, Catalog, Bilona Story)
│   │   │   ├── products/    # Product list & [slug] Product Detail Page (PDP)
│   │   │   ├── checkout/    # Guest checkout form & order creation
│   │   │   ├── payment/     # Payment simulator & verification
│   │   │   ├── track/       # Order tracking lookup
│   │   │   └── account/     # Customer order history
│   │   ├── admin/           # Secured Admin Portal
│   │   │   ├── login/       # Admin login
│   │   │   ├── orders/      # Order processing & shipment dispatch
│   │   │   ├── products/    # Catalog CRUD & variant controls
│   │   │   ├── shipping/    # Logistics carrier tracking
│   │   │   └── settings/    # Store configuration
│   │   ├── api/             # REST Route handlers (Checkout, Admin, Tracking, Auth)
│   │   ├── robots.ts        # Dynamic /robots.txt
│   │   ├── sitemap.ts       # Dynamic /sitemap.xml
│   │   ├── layout.tsx       # Root layout, JSON-LD Schema, Fonts
│   │   └── globals.css      # Custom tailwind tokens & animations
│   ├── components/
│   │   ├── cart/            # CartDrawer & line-item controls
│   │   ├── layout/          # Navbar, Footer, WhatsAppButton, CookieConsent
│   │   ├── products/        # ProductCard, ProductImageGallery, VariantSelector
│   │   └── admin/           # AdminSidebar, OrderMasterTable, ProductForm
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # Session signing & password verification
│   │   ├── services/        # Pluggable Payment & Shipping adapters
│   │   ├── store/           # Zustand cart store
│   │   └── utils/           # Pincode dictionary & pricing calculations
│   └── middleware.ts        # Edge middleware for /admin route security
├── tests/                   # Automated integration and unit test suites
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind theme extensions (colors, aspect ratios)
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher (Node 22 LTS recommended)
- **npm**: `v10.x` or higher

### Installation & Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rishabhjainofficial/samriddhi-ghee.git
   cd samriddhi-ghee
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Service Providers ("MOCK" for local development)
   PAYMENT_PROVIDER="MOCK"
   SHIPPING_PROVIDER="MOCK"

   # Security
   ADMIN_SESSION_SECRET="samriddhi-super-secret-key-32-chars-minimum-prod"

   # Site URL for canonical SEO & Sitemaps (optional in dev)
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

### Database Setup & Seeding

Run Prisma migrations and populate the database with default catalog data and admin credentials:

```bash
# Push schema to SQLite database
npm run db:push

# Seed admin user, product variants, and store settings
npm run db:seed
```

### Running the Application

```bash
# Development mode (with Turbopack / Hot Reload)
npm run dev

# Production build & start
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Test Suite

The repository includes a comprehensive test suite validating database integrity, pricing formulas, checkout flows, and admin APIs:

```bash
# Run all core verification tests
npm run test:cart         # Cart subtotals, free shipping thresholds & pincodes
npm run test:checkout     # End-to-end guest checkout & order creation
npm run test:auth         # Admin session issuance & password verification
npm run test:orders       # Order status transitions & lifecycle
npm run test:products     # Product & variant catalog updates
npm run test:shipping     # Mock carrier dispatch & tracking generation
npm run test:settings     # Store configuration & policy updates
npm run test:adapters     # Payment & Shipping modular adapter contracts
```

---

## 💳 Payment & Shipping Integration

The application follows the **Adapter Pattern** located in `src/lib/services/`:

- **Payment Providers** (`src/lib/services/payment/`):
  - `MOCK`: Instant verification simulator for local demo and offline testing.
  - Readily pluggable for **Razorpay** (`orders.create`, webhook signature verification) and **Cashfree** / **PhonePe**.
- **Shipping Providers** (`src/lib/services/shipping/`):
  - `MOCK`: Generates realistic mock AWB numbers and track links (`https://track.sanvritghee.com/{awb}`).
  - Ready for integration with **Shiprocket API** or **Delhivery Direct API**.

To switch to production providers, implement the interface contract in `types.ts` and update `PAYMENT_PROVIDER` or `SHIPPING_PROVIDER` in your `.env`.

---

## 🔐 Admin Credentials

Default credentials created by `npm run db:seed`:

- **Portal URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@sanvritghee.com`
- **Password**: `Admin@12345`

*(Be sure to update password and `ADMIN_SESSION_SECRET` before deploying to production environments.)*

---

## 📜 Compliance & Details

- **Brand**: Sanvrit Ghee
- **Manufacturer**: Dharmasya Food Products Pvt. Ltd.
- **FSSAI License**: `22225088000714`
- **Origin**: Udaipur, Rajasthan, India

---

## 📄 License

Private & Proprietary — Developed for Dharmasya Food Products Pvt. Ltd. All rights reserved.
