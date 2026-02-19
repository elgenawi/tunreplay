import { NextRequest } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const rows = await query<{ id: number; slug: string }[]>("SELECT id, slug FROM series");
  const list = Array.isArray(rows) ? rows : [];
  return Response.json({
    received: slug,
    receivedLength: slug.length,
    receivedHex: Buffer.from(slug, "utf8").toString("hex"),
    dbSlugs: list.map((r) => ({ id: r.id, slug: r.slug, hex: Buffer.from(r.slug, "utf8").toString("hex") })),
    match: list.find((r) => r.slug === slug) ?? null,
  });
}
