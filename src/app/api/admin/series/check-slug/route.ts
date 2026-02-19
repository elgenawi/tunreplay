import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").trim();
  const excludeId = searchParams.get("excludeId");

  if (!title) {
    return NextResponse.json({ slug: "" });
  }

  const base = title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  let candidate = base;
  let suffix = 0;

  while (true) {
    const params: (string | number)[] = [candidate];
    let sql = "SELECT id FROM series WHERE slug = ?";
    if (excludeId) {
      sql += " AND id != ?";
      params.push(Number(excludeId));
    }
    sql += " LIMIT 1";

    const rows = await query<{ id: number }[]>(sql, params);
    if (!Array.isArray(rows) || rows.length === 0) break;
    suffix++;
    candidate = `${base}-${suffix}`;
  }

  return NextResponse.json({ slug: candidate });
}
