import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const displayName = typeof name === "string" ? name.trim() || null : null;

    await query(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')",
      [emailNorm, passwordHash, displayName]
    );

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.",
    });
  } catch (err: unknown) {
    const message = err && typeof err === "object" && "code" in err && (err as { code: string }).code === "ER_DUP_ENTRY"
      ? "هذا البريد الإلكتروني مستخدم بالفعل"
      : "حدث خطأ أثناء إنشاء الحساب";
    console.error("Register error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
