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
  type_name: string | null;
  type_slug: string | null;
  nation_name: string | null;
  nation_slug: string | null;
  year_name: string | null;
  status_name: string | null;
  status_slug: string | null;
  genres: Genre[];
}

export async function getSeriesData(slug: string): Promise<SeriesData | null> {
  try {
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
       WHERE s.slug = ?
       LIMIT 1`,
      [slug]
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
