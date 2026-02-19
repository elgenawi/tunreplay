import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const rows = await query<UserRow[]>(
      "SELECT id, email, name, role FROM users WHERE id = ? LIMIT 1",
      [payload.userId]
    );

    const user = Array.isArray(rows) ? rows[0] : null;
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Session error:", err);
    return NextResponse.json({ user: null });
  }
}
