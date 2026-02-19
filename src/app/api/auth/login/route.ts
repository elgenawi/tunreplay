import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  verifyPassword,
  createToken,
  getAuthCookieName,
  getAuthCookieOptions,
} from "@/lib/auth";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const rows = await query<UserRow[]>(
      "SELECT id, email, password_hash, name, role FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );

    const user = Array.isArray(rows) ? rows[0] : null;
    if (!user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      exp: 0,
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set(getAuthCookieName(), token, getAuthCookieOptions());

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
