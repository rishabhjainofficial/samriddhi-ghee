import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/services/payment";
import { calculateOrderTotals } from "@/lib/utils/pricing";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, shippingAddress, items, notes } = body;

    if (!customer?.name || !customer?.phone || !shippingAddress?.address || !shippingAddress?.pincode) {
      return NextResponse.json(
        { error: "Missing required contact or shipping address information." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    // 1. Fetch live variant details from database for pricing integrity
    const variantIds = items.map((i: any) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (variants.length !== items.length) {
      return NextResponse.json(
        { error: "One or more selected items are no longer available." },
        { status: 400 }
      );
    }

    // 2. Compute verified subtotal and build order items
    let verifiedSubtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) continue;

      if (variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${variant.product.title} (${variant.title}). Only ${variant.stockQuantity} available.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = variant.price * item.quantity;
      verifiedSubtotal += itemTotal;

      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,
        title: variant.product.title,
        variantTitle: variant.title,
        price: variant.price,
        quantity: item.quantity,
        weightInGrams: variant.weightInGrams,
      });
    }

    // 3. Compute totals using store pricing settings
    const settings = await prisma.storeSetting.findMany();
    const enableTax = settings.find((s) => s.key === "enableTax")?.value === "true";
    const taxRate = parseFloat(settings.find((s) => s.key === "taxRate")?.value || "0");
    const enableShippingFee = settings.find((s) => s.key === "enableShippingFee")?.value === "true";
    const flatShippingRate = parseFloat(settings.find((s) => s.key === "flatShippingRate")?.value || "0");
    const freeShippingThreshold = parseFloat(settings.find((s) => s.key === "freeShippingThreshold")?.value || "999");

    const totals = calculateOrderTotals(verifiedSubtotal, {
      enableTax,
      taxRate,
      enableShippingFee,
      flatShippingRate,
      freeShippingThreshold,
    });

    // 4. Create or Update Customer Profile in Database
    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);
    const cleanEmail = customer.email ? customer.email.trim().toLowerCase() : null;

    let customerRecord = null;
    try {
      customerRecord = await prisma.customer.upsert({
        where: { phone: cleanPhone },
        update: {
          name: customer.name.trim(),
          email: cleanEmail,
          addressLine1: shippingAddress.address.trim(),
          landmark: shippingAddress.landmark ? shippingAddress.landmark.trim() : null,
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pincode: shippingAddress.pincode.trim(),
        },
        create: {
          name: customer.name.trim(),
          phone: cleanPhone,
          email: cleanEmail,
          addressLine1: shippingAddress.address.trim(),
          landmark: shippingAddress.landmark ? shippingAddress.landmark.trim() : null,
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pincode: shippingAddress.pincode.trim(),
        },
      });
    } catch (customerErr) {
      console.warn("Customer upsert warning:", customerErr);
    }

    // 5. Create Order & Shipping Address in database
    const orderNumber = `SG-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerRecord?.id || null,
        customerName: customer.name.trim(),
        customerEmail: customer.email ? customer.email.trim() : `${cleanPhone}@guest.sanvrit.in`,
        customerPhone: cleanPhone,
        status: "PENDING_PAYMENT",
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        notes: notes ? notes.trim() : null,
        shippingAddress: {
          create: {
            recipientName: customer.name.trim(),
            phone: cleanPhone,
            addressLine1: shippingAddress.address.trim(),
            addressLine2: shippingAddress.landmark ? shippingAddress.landmark.trim() : null,
            landmark: shippingAddress.landmark ? shippingAddress.landmark.trim() : null,
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            pincode: shippingAddress.pincode.trim(),
          },
        },
        items: {
          create: orderItemsData,
        },
      },
    });

    // 6. Initialize payment order with Pluggable Gateway
    const paymentGateway = getPaymentGateway();
    const paymentOrder = await paymentGateway.createPaymentOrder({
      orderId: order.id,
      amountInPaise: Math.round(order.totalAmount * 100),
      currency: "INR",
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
    });

    const response = NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      gatewayOrderId: paymentOrder.gatewayOrderId,
      checkoutUrl: paymentOrder.checkoutUrl,
    });

    // Set cookie so customer can immediately view profile & past orders
    response.cookies.set("sanvrit_customer_phone", cleanPhone, {
      maxAge: 365 * 86400,
      path: "/",
      sameSite: "lax",
    });
    response.cookies.set("samriddhi_customer_phone", cleanPhone, {
      maxAge: 365 * 86400,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order creation" },
      { status: 500 }
    );
  }
}
