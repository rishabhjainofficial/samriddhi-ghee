import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("sanvrit_admin_token");
  response.cookies.delete("samriddhi_admin_token");
  return response;
}
