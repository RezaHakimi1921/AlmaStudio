import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  createSessionToken,
  getAdminCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };
  const creds = getAdminCredentials();

  if (
    body.username !== creds.username ||
    body.password !== creds.password
  ) {
    return NextResponse.json(
      { ok: false, error: "نام کاربری یا رمز عبور نادرست است" },
      { status: 401 },
    );
  }

  const token = createSessionToken(creds.username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
