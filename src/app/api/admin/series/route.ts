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

export async function GET() {
  const rows = await query(`
    SELECT s.*, t.name as type_name, n.name as nation_name, y.name as year_name, st.name as status_name
    FROM series s
    LEFT JOIN types t ON s.type_id = t.id
    LEFT JOIN nations n ON s.nation_id = n.id
    LEFT JOIN years y ON s.year_id = y.id
    LEFT JOIN statuses st ON s.status_id = st.id
    ORDER BY s.pinned DESC, s.id DESC
  `);
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { title, slug, image, duration, source, episodes_number, season, trailer_embed_vid, type_id, nation_id, year_id, status_id, release_date, genre_ids } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const result = await query<{ insertId: number }>(
    `INSERT INTO series (title, slug, image, duration, source, episodes_number, season, trailer_embed_vid, type_id, nation_id, year_id, status_id, release_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, image || null, duration || null, source || null, episodes_number || null, season || null, trailer_embed_vid || null, type_id || null, nation_id || null, year_id || null, status_id || null, release_date || null]
  );

  const seriesId = (result as unknown as { insertId: number }).insertId;

  if (Array.isArray(genre_ids) && genre_ids.length > 0) {
    for (const gid of genre_ids) {
      await query("INSERT INTO series_genres (series_id, genre_id) VALUES (?, ?)", [seriesId, gid]);
    }
  }

  return NextResponse.json({ success: true, id: seriesId });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { id, title, slug, image, duration, source, episodes_number, season, trailer_embed_vid, type_id, nation_id, year_id, status_id, release_date, genre_ids } = body;

  if (!id || !title || !slug) {
    return NextResponse.json({ error: "id, title and slug are required" }, { status: 400 });
  }

  await query(
    `UPDATE series SET title=?, slug=?, image=?, duration=?, source=?, episodes_number=?, season=?, trailer_embed_vid=?, type_id=?, nation_id=?, year_id=?, status_id=?, release_date=? WHERE id=?`,
    [title, slug, image || null, duration || null, source || null, episodes_number || null, season || null, trailer_embed_vid || null, type_id || null, nation_id || null, year_id || null, status_id || null, release_date || null, id]
  );

  await query("DELETE FROM series_genres WHERE series_id = ?", [id]);
  if (Array.isArray(genre_ids) && genre_ids.length > 0) {
    for (const gid of genre_ids) {
      await query("INSERT INTO series_genres (series_id, genre_id) VALUES (?, ?)", [id, gid]);
    }
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { id, pinned } = body;

  if (!id || typeof pinned !== "number") {
    return NextResponse.json({ error: "id and pinned are required" }, { status: 400 });
  }

  await query("UPDATE series SET pinned = ? WHERE id = ?", [pinned ? 1 : 0, id]);
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

  await query("DELETE FROM series WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
