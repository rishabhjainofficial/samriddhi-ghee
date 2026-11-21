import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Standard mock image upload endpoint returning sample high-res ghee imagery
    return NextResponse.json({
      success: true,
      url: "/images/a2-cow-ghee.jpg",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
