import { query } from "@/lib/db";

export interface Genre {
  name: string;
  slug: string;
}

export interface Episode {
  id: number;
  title: string;
  slug: string;
  episode_number: number;
  image: string | null;
  season: number;
  created_at: string;
}

export interface SeriesData {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  duration: string | null;
  source: string | null;
  episodes_number: number | null;
  season: number | null;
  trailer_embed_vid: string | null;
  release_date: string | null;
  description: string | null;
  type_name: string | null;
  type_slug: string | null;
  nation_name: string | null;
  nation_slug: string | null;
  year_name: string | null;
  status_name: string | null;
  status_slug: string | null;
  genres: Genre[];
}

/** Normalize slug for comparison: trim, NFC, and collapse dash variants to hyphen-minus */
function normalizeSlugForMatch(s: string): string {
  const t = (s || "").trim().normalize("NFC");
  return t.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-");
}

/** Latin suffix of slug (e.g. "serie-accident") for fallback match when Arabic encoding differs */
function getLatinSuffix(s: string): string {
  const match = (s || "").trim().match(/-[a-z0-9-]+$/i);
  return match ? match[0].replace(/^-/, "") : "";
}

export async function getSeriesData(slug: string): Promise<SeriesData | null> {
  try {
    const rawSlug = (slug || "").trim();
    const normalizedInput = normalizeSlugForMatch(rawSlug);
    const latinSuffix = getLatinSuffix(normalizedInput);

    const allSlugs = await query<{ id: number; slug: string }[]>(
      "SELECT id, slug FROM series"
    );
    const list = Array.isArray(allSlugs) ? allSlugs : [];
    if (list.length === 0) return null;

    let match: { id: number; slug: string } | null = list.find((row) => {
      const rowSlug = String(row.slug ?? "").trim();
      const dbSlug = normalizeSlugForMatch(rowSlug);
      const inputNfd = normalizedInput.normalize("NFD");
      const rowNfd = dbSlug.normalize("NFD");
      return (
        dbSlug === normalizedInput ||
        rowNfd === inputNfd ||
        rowSlug === rawSlug ||
        rowSlug === slug
      );
    }) ?? null;

    if (!match && latinSuffix) {
      const bySuffix = list.filter((row) => {
        const rowSlug = String(row.slug ?? "").trim();
        return getLatinSuffix(normalizeSlugForMatch(rowSlug)) === latinSuffix;
      });
      if (bySuffix.length === 1) match = bySuffix[0];
    }

    if (!match && latinSuffix) {
      const byLike = await query<{ id: number }[]>(
        "SELECT id FROM series WHERE slug LIKE ? LIMIT 2",
        ["%" + latinSuffix]
      );
      const likeList = Array.isArray(byLike) ? byLike : [];
      if (likeList.length === 1) match = { id: likeList[0].id, slug: "" };
    }

    if (!match) return null;

    const rows = await query<Record<string, unknown>[]>(
      `SELECT s.*, t.name as type_name, t.slug as type_slug,
              n.name as nation_name, n.slug as nation_slug,
              y.name as year_name,
              st.name as status_name, st.slug as status_slug
       FROM series s
       LEFT JOIN types t ON s.type_id = t.id
       LEFT JOIN nations n ON s.nation_id = n.id
       LEFT JOIN years y ON s.year_id = y.id
       LEFT JOIN statuses st ON s.status_id = st.id
       WHERE s.id = ?
       LIMIT 1`,
      [match.id]
    );

    if (!Array.isArray(rows) || rows.length === 0) return null;

    const series = rows[0] as unknown as SeriesData;

    const genreRows = await query<Genre[]>(
      `SELECT g.name, g.slug FROM series_genres sg
       JOIN genres g ON sg.genre_id = g.id
       WHERE sg.series_id = ?`,
      [series.id]
    );

    series.genres = Array.isArray(genreRows) ? genreRows : [];
    return series;
  } catch (error) {
    console.error("Error fetching series data:", error);
    return null;
  }
}

export async function getSeriesEpisodes(
  seriesId: number,
  page: number = 1,
  limit: number = 40
) {
  try {
    const countRows = await query<{ total: number }[]>(
      "SELECT COUNT(*) as total FROM episodes WHERE series_id = ?",
      [seriesId]
    );
    const totalEpisodes = Array.isArray(countRows) ? countRows[0]?.total ?? 0 : 0;
    const totalPages = Math.max(1, Math.ceil(totalEpisodes / limit));
    const offset = (page - 1) * limit;

    const episodes = await query<Episode[]>(
      `SELECT id, title, slug, episode_number, image, season, created_at
       FROM episodes WHERE series_id = ?
       ORDER BY season, episode_number
       LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      [seriesId]
    );

    return {
      episodes: Array.isArray(episodes) ? episodes : [],
      totalEpisodes,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return { episodes: [], totalEpisodes: 0, totalPages: 1, currentPage: page };
  }
}

export async function getAllEpisodes(seriesId: number) {
  try {
    const episodes = await query<Episode[]>(
      `SELECT id, title, slug, episode_number, image, season, created_at
       FROM episodes WHERE series_id = ?
       ORDER BY season, episode_number`,
      [seriesId]
    );
    return Array.isArray(episodes) ? episodes : [];
  } catch (error) {
    console.error("Error fetching all episodes:", error);
    return [];
  }
}
