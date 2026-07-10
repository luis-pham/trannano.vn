import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  comparePassword,
  signToken,
  COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return jsonError("Email và mật khẩu bắt buộc");

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return jsonError("Email hoặc mật khẩu không đúng", 401);

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return jsonError("Email hoặc mật khẩu không đúng", 401);

    const token = await signToken({ sub: user.id, email: user.email });
    const response = NextResponse.json({ ok: true, email: user.email });
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());
    return response;
  } catch {
    return jsonError("Lỗi đăng nhập", 500);
  }
}
