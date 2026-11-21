import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";

const ALLOWED_SETTING_KEYS = new Set([
  "enableTax",
  "taxRate",
  "enableShippingFee",
  "flatShippingRate",
  "freeShippingThreshold",
  "isCodEnabled",
  "supportPhone",
  "supportEmail",
  "storeNotice",
]);

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Valid administrator session required." },
        { status: 401 }
      );
    }

    const settingsMap = await req.json();

    for (const [key, value] of Object.entries(settingsMap)) {
      if (!ALLOWED_SETTING_KEYS.has(key)) {
        continue; // Discard unapproved or unexpected configuration keys
      }

      await prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
