import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Valid administrator session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, slug, description, benefits, ingredients, categoryId, images, isActive, variants } = body;

    const created = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        benefits,
        ingredients,
        categoryId,
        images: JSON.stringify(images || []),
        isActive: isActive ?? true,
        variants: {
          create: variants.map((v: any) => ({
            title: v.title,
            sku: v.sku,
            price: v.price,
            mrp: v.mrp,
            stockQuantity: v.stockQuantity,
            weightInGrams: v.weightInGrams,
            lengthCm: v.lengthCm || 15,
            breadthCm: v.breadthCm || 15,
            heightCm: v.heightCm || 15,
            isActive: v.isActive ?? true,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Valid administrator session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, title, slug, description, benefits, ingredients, categoryId, images, isActive, variants } = body;

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Update product & sync variants
    await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        benefits,
        ingredients,
        categoryId,
        images: JSON.stringify(images || []),
        isActive: isActive ?? true,
      },
    });

    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              title: v.title,
              sku: v.sku,
              price: v.price,
              mrp: v.mrp,
              stockQuantity: v.stockQuantity,
              weightInGrams: v.weightInGrams,
              lengthCm: v.lengthCm || 15,
              breadthCm: v.breadthCm || 15,
              heightCm: v.heightCm || 15,
              isActive: v.isActive ?? true,
            },
          });
        } else {
          await prisma.productVariant.create({
            data: {
              productId: id,
              title: v.title,
              sku: v.sku,
              price: v.price,
              mrp: v.mrp,
              stockQuantity: v.stockQuantity,
              weightInGrams: v.weightInGrams,
              lengthCm: v.lengthCm || 15,
              breadthCm: v.breadthCm || 15,
              heightCm: v.heightCm || 15,
              isActive: v.isActive ?? true,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
