import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (!verifyAdminPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return new NextResponse(null, {
      status: 303,
      headers: { location: "/admin/login?error=1" }
    });
  }

  const response = new NextResponse(null, {
    status: 303,
    headers: { location: "/admin/analytics" }
  });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), adminCookieOptions());
  return response;
}
