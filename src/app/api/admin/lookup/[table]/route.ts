import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const ALLOWED_TABLES: Record<string, { columns: string[]; hasSlug: boolean }> = {
  types:    { columns: ["name", "slug"], hasSlug: true },
  nations:  { columns: ["name", "slug"], hasSlug: true },
  genres:   { columns: ["name", "slug"], hasSlug: true },
  statuses: { columns: ["name", "slug"], hasSlug: true },
  years:    { columns: ["name"], hasSlug: false },
};

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES[table]) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }
  const rows = await query(`SELECT * FROM ${table} ORDER BY id DESC`);
  return NextResponse.json({ data: rows });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { table } = await params;
  const config = ALLOWED_TABLES[table];
  if (!config) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const body = await req.json();
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (config.hasSlug) {
    const slug = (body.slug || "").trim() || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
    await query(`INSERT INTO ${table} (name, slug) VALUES (?, ?)`, [name, slug]);
  } else {
    await query(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
  }

  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { table } = await params;
  const config = ALLOWED_TABLES[table];
  if (!config) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const body = await req.json();
  const { id, name, slug } = body;
  if (!id || !name) {
    return NextResponse.json({ error: "id and name are required" }, { status: 400 });
  }

  if (config.hasSlug) {
    const finalSlug = (slug || "").trim() || name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
    await query(`UPDATE ${table} SET name = ?, slug = ? WHERE id = ?`, [name.trim(), finalSlug, id]);
  } else {
    await query(`UPDATE ${table} SET name = ? WHERE id = ?`, [name.trim(), id]);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { table } = await params;
  if (!ALLOWED_TABLES[table]) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  return NextResponse.json({ success: true });
}
