import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seriesId = searchParams.get("series_id");

  let sql = `
    SELECT e.*, s.title as series_title
    FROM episodes e
    LEFT JOIN series s ON e.series_id = s.id
  `;
  const params: (string | number)[] = [];

  if (seriesId) {
    sql += " WHERE e.series_id = ?";
    params.push(Number(seriesId));
  }

  sql += " ORDER BY e.series_id, e.season, e.episode_number";

  const rows = await query(sql, params);
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { series_id, episode_number, title, slug, image, embed_url, description, season } = body;

  if (!series_id || !title || !slug) {
    return NextResponse.json({ error: "series_id, title and slug are required" }, { status: 400 });
  }

  const result = await query<{ insertId: number }>(
    `INSERT INTO episodes (series_id, episode_number, title, slug, image, embed_url, description, season)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [series_id, episode_number || 1, title, slug, image || null, embed_url || null, description || null, season || 1]
  );

  const id = (result as unknown as { insertId: number }).insertId;
  return NextResponse.json({ success: true, id });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { id, series_id, episode_number, title, slug, image, embed_url, description, season } = body;

  if (!id || !title || !slug) {
    return NextResponse.json({ error: "id, title and slug are required" }, { status: 400 });
  }

  await query(
    `UPDATE episodes SET series_id=?, episode_number=?, title=?, slug=?, image=?, embed_url=?, description=?, season=? WHERE id=?`,
    [series_id, episode_number || 1, title, slug, image || null, embed_url || null, description || null, season || 1, id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await query("DELETE FROM episodes WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
