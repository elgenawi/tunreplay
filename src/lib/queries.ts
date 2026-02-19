import { query } from "@/lib/db";

export interface SeriesListItem {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  duration: string | null;
  source: string | null;
  episodes_number: number | null;
  season: number | null;
  pinned: number;
  nation_name: string | null;
  nation_slug: string | null;
  year_name: string | null;
  type_name: string | null;
  type_slug: string | null;
}

export interface LatestEpisode {
  id: number;
  title: string;
  slug: string;
  episode_number: number;
  image: string | null;
  series_slug: string;
}

const SERIES_BASE_SELECT = `
  SELECT s.id, s.title, s.slug, s.image, s.duration, s.source,
         s.episodes_number, s.season, s.pinned,
         n.name as nation_name, n.slug as nation_slug,
         y.name as year_name,
         t.name as type_name, t.slug as type_slug
  FROM series s
  LEFT JOIN nations n ON s.nation_id = n.id
  LEFT JOIN years y ON s.year_id = y.id
  LEFT JOIN types t ON s.type_id = t.id
`;

export async function getPinnedSeries(): Promise<SeriesListItem[]> {
  try {
    const rows = await query<SeriesListItem[]>(
      `${SERIES_BASE_SELECT} WHERE s.pinned = 1 ORDER BY s.id DESC LIMIT 6`
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error fetching pinned series:", error);
    return [];
  }
}

export async function getLatestSeriesByType(typeSlug: string, limit = 6): Promise<SeriesListItem[]> {
  try {
    const rows = await query<SeriesListItem[]>(
      `${SERIES_BASE_SELECT} WHERE t.slug = ? ORDER BY s.id DESC LIMIT ${Number(limit)}`,
      [typeSlug]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error(`Error fetching latest ${typeSlug}:`, error);
    return [];
  }
}

export async function getLatestSeries(limit = 6) {
  return getLatestSeriesByType("مسلسلات", limit);
}

export async function getLatestMovies(limit = 6) {
  return getLatestSeriesByType("افلام", limit);
}

export async function getLatestAnime(limit = 6) {
  return getLatestSeriesByType("انمي", limit);
}

export async function getLatestEpisodes(limit = 16): Promise<LatestEpisode[]> {
  try {
    const rows = await query<LatestEpisode[]>(
      `SELECT e.id, e.title, e.slug, e.episode_number, e.image,
              s.slug as series_slug
       FROM episodes e
       JOIN series s ON e.series_id = s.id
       ORDER BY e.created_at DESC
       LIMIT ${Number(limit)}`
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error fetching latest episodes:", error);
    return [];
  }
}
