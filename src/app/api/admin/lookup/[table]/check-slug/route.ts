import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const TABLES_WITH_SLUG = ["types", "nations", "genres", "statuses"];

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!TABLES_WITH_SLUG.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim();
  const excludeId = searchParams.get("excludeId");

  if (!name) {
    return NextResponse.json({ slug: "" });
  }

  let candidate = slugFromName(name);
  let suffix = 0;

  while (true) {
    const queryParams: (string | number)[] = [candidate];
    let sql = `SELECT id FROM ${table} WHERE slug = ?`;
    if (excludeId) {
      sql += " AND id != ?";
      queryParams.push(Number(excludeId));
    }
    sql += " LIMIT 1";

    const rows = await query<{ id: number }[]>(sql, queryParams);
    if (!Array.isArray(rows) || rows.length === 0) break;
    suffix++;
    candidate = `${slugFromName(name)}-${suffix}`;
  }

  return NextResponse.json({ slug: candidate });
}
