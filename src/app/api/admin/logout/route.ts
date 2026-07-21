import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const response = new NextResponse(null, {
    status: 303,
    headers: { location: "/admin/login" }
  });
  response.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions(), maxAge: 0 });
  return response;
}
