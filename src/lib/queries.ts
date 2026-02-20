import { query } from "@/lib/db";

export interface NavMenuItem {
  id: number;
  menu_name: string;
  slug: string;
  category: { id: string; name: string; slug: string }[];
}

export interface SocialMediaItem {
  id: number;
  name: string;
  link: string;
}

export async function getNavMenuItems(): Promise<NavMenuItem[]> {
  try {
    const rows = await query<{ id: number; name: string; slug: string }[]>(
      "SELECT id, name, slug FROM types ORDER BY id"
    );
    if (!Array.isArray(rows)) return [];
    return rows.map((t) => ({
      id: t.id,
      menu_name: t.name,
      slug: t.slug,
      category: [],
    }));
  } catch (error) {
    console.error("Error fetching nav menu items:", error);
    return [];
  }
}

export async function getSocialMediaItems(): Promise<SocialMediaItem[]> {
  return [];
}

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

const ITEMS_PER_PAGE = 20;

export async function getTypeBySlug(slug: string): Promise<{ id: number; name: string; slug: string } | null> {
  try {
    const rows = await query<{ id: number; name: string; slug: string }[]>(
      "SELECT id, name, slug FROM types WHERE slug = ? LIMIT 1",
      [slug]
    );
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching type by slug:", error);
    return null;
  }
}

export async function getNationBySlug(slug: string): Promise<{ id: number; name: string; slug: string } | null> {
  try {
    const rows = await query<{ id: number; name: string; slug: string }[]>(
      "SELECT id, name, slug FROM nations WHERE slug = ? LIMIT 1",
      [slug]
    );
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching nation by slug:", error);
    return null;
  }
}

export async function getGenreBySlug(slug: string): Promise<{ id: number; name: string; slug: string } | null> {
  try {
    const rows = await query<{ id: number; name: string; slug: string }[]>(
      "SELECT id, name, slug FROM genres WHERE slug = ? LIMIT 1",
      [slug]
    );
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching genre by slug:", error);
    return null;
  }
}

export async function getSeriesCountByTypeSlug(typeSlug: string): Promise<number> {
  try {
    const rows = await query<{ total: number }[]>(
      `SELECT COUNT(*) as total FROM series s JOIN types t ON s.type_id = t.id WHERE t.slug = ?`,
      [typeSlug]
    );
    return Array.isArray(rows) && rows[0] ? Number(rows[0].total) : 0;
  } catch (error) {
    return 0;
  }
}

export async function getSeriesCountByNationSlug(nationSlug: string): Promise<number> {
  try {
    const rows = await query<{ total: number }[]>(
      `SELECT COUNT(*) as total FROM series s JOIN nations n ON s.nation_id = n.id WHERE n.slug = ?`,
      [nationSlug]
    );
    return Array.isArray(rows) && rows[0] ? Number(rows[0].total) : 0;
  } catch (error) {
    return 0;
  }
}

export async function getSeriesCountByGenreSlug(genreSlug: string): Promise<number> {
  try {
    const rows = await query<{ total: number }[]>(
      `SELECT COUNT(DISTINCT s.id) as total FROM series s
       JOIN series_genres sg ON s.id = sg.series_id
       JOIN genres g ON sg.genre_id = g.id
       WHERE g.slug = ?`,
      [genreSlug]
    );
    return Array.isArray(rows) && rows[0] ? Number(rows[0].total) : 0;
  } catch (error) {
    return 0;
  }
}

export async function getSeriesByTypeSlug(
  typeSlug: string,
  page: number
): Promise<SeriesListItem[]> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const rows = await query<SeriesListItem[]>(
      `${SERIES_BASE_SELECT} WHERE t.slug = ? ORDER BY s.id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [typeSlug]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error fetching series by type:", error);
    return [];
  }
}

export async function getSeriesByNationSlug(
  nationSlug: string,
  page: number
): Promise<SeriesListItem[]> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const rows = await query<SeriesListItem[]>(
      `${SERIES_BASE_SELECT} WHERE n.slug = ? ORDER BY s.id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [nationSlug]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error fetching series by nation:", error);
    return [];
  }
}

export async function getSeriesByGenreSlug(
  genreSlug: string,
  page: number
): Promise<SeriesListItem[]> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const rows = await query<SeriesListItem[]>(
      `SELECT s.id, s.title, s.slug, s.image, s.duration, s.source,
              s.episodes_number, s.season, s.pinned,
              n.name as nation_name, n.slug as nation_slug,
              y.name as year_name,
              t.name as type_name, t.slug as type_slug
       FROM series s
       LEFT JOIN nations n ON s.nation_id = n.id
       LEFT JOIN years y ON s.year_id = y.id
       LEFT JOIN types t ON s.type_id = t.id
       JOIN series_genres sg ON s.id = sg.series_id
       JOIN genres g ON sg.genre_id = g.id
       WHERE g.slug = ?
       GROUP BY s.id
       ORDER BY s.id DESC
       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [genreSlug]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error fetching series by genre:", error);
    return [];
  }
}

export async function getYearByName(name: string): Promise<{ id: number; name: string } | null> {
  try {
    const rows = await query<{ id: number; name: string }[]>(
      "SELECT id, name FROM years WHERE name = ? LIMIT 1",
      [name]
    );
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch (error) {
    return null;
  }
}

export async function getSeriesCountByYearName(yearName: string): Promise<number> {
  try {
    const rows = await query<{ total: number }[]>(
      `SELECT COUNT(*) as total FROM series s JOIN years y ON s.year_id = y.id WHERE y.name = ?`,
      [yearName]
    );
    return Array.isArray(rows) && rows[0] ? Number(rows[0].total) : 0;
  } catch (error) {
    return 0;
  }
}

export async function getSeriesByYearName(
  yearName: string,
  page: number
): Promise<SeriesListItem[]> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const rows = await query<SeriesListItem[]>(
      `${SERIES_BASE_SELECT} WHERE y.name = ? ORDER BY s.id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [yearName]
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    return [];
  }
}

/** Shape expected by مواعيد-الحلقات ClientSchedule (grouped by time). */
export interface ScheduleSlot {
  id: number;
  time: string;
  day: string;
  seies: Array<{
    series_id: {
      id: number;
      title: string;
      poster: string | null;
      story: string;
      slug: string;
      imdb: string | null;
      duration: string | null;
      category: { name: string; slug: string } | null;
      nation: { name: string; slug: string } | null;
      quality: { name: string; slug: string } | null;
      year: { name: string; slug: string } | null;
    };
  }>;
}

export async function getScheduleByDay(day: string): Promise<ScheduleSlot[]> {
  try {
    const rows = await query<
      {
        id: number;
        time: string;
        day: string;
        series_id: number;
        title: string;
        slug: string;
        image: string | null;
        description: string | null;
        duration: string | null;
        type_name: string | null;
        type_slug: string | null;
        nation_name: string | null;
        nation_slug: string | null;
        year_name: string | null;
      }[]
    >(
      `SELECT sch.id, sch.day, sch.time, sch.series_id,
              s.title, s.slug, s.image, s.description, s.duration,
              t.name AS type_name, t.slug AS type_slug,
              n.name AS nation_name, n.slug AS nation_slug,
              y.name AS year_name
       FROM schedule sch
       JOIN series s ON sch.series_id = s.id
       LEFT JOIN types t ON s.type_id = t.id
       LEFT JOIN nations n ON s.nation_id = n.id
       LEFT JOIN years y ON s.year_id = y.id
       WHERE sch.day = ?
       ORDER BY sch.time ASC`,
      [day]
    );
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const slotMap = new Map<string, ScheduleSlot>();
    for (const r of rows) {
      const rawTime = r.time;
      const timeStr =
        typeof rawTime === "string"
          ? rawTime.slice(0, 5)
          : rawTime && typeof (rawTime as { toString?: () => string }).toString === "function"
            ? (rawTime as { toString: () => string }).toString().slice(0, 5)
            : "";
      const key = `${r.day}-${timeStr}`;
      const slot = slotMap.get(key);
      const seriesPayload = {
        id: r.series_id,
        title: r.title,
        poster: r.image ?? "",
        story: r.description ?? "",
        slug: r.slug,
        imdb: null,
        duration: r.duration ?? null,
        category: r.type_name
          ? { name: r.type_name, slug: r.type_slug ?? "" }
          : null,
        nation: r.nation_name
          ? { name: r.nation_name, slug: r.nation_slug ?? "" }
          : null,
        quality: null,
        year: r.year_name ? { name: r.year_name, slug: "" } : null,
      };
      if (slot) {
        slot.seies.push({ series_id: seriesPayload });
      } else {
        slotMap.set(key, {
          id: r.id,
          time: timeStr,
          day: r.day,
          seies: [{ series_id: seriesPayload }],
        });
      }
    }
    return Array.from(slotMap.values()).sort(
      (a, b) => a.time.localeCompare(b.time)
    );
  } catch (error) {
    console.error("Error fetching schedule by day:", error);
    return [];
  }
}

export interface ScheduleRowAdmin {
  id: number;
  day: string;
  time: string;
  series_id: number;
  series_title: string;
  series_slug: string;
}

export async function getScheduleListForAdmin(): Promise<ScheduleRowAdmin[]> {
  try {
    const rows = await query<ScheduleRowAdmin[]>(
      `SELECT sch.id, sch.day, sch.time, sch.series_id, s.title AS series_title, s.slug AS series_slug
       FROM schedule sch
       JOIN series s ON sch.series_id = s.id
       ORDER BY sch.day, sch.time, s.title`
    );
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error fetching schedule list:", error);
    return [];
  }
}

export async function insertScheduleRow(
  day: string,
  time: string,
  series_id: number
): Promise<number> {
  const r = await query<{ insertId: number }>(
    "INSERT INTO schedule (day, time, series_id) VALUES (?, ?, ?)",
    [day, time, series_id]
  );
  return (r as unknown as { insertId: number }).insertId;
}

export async function deleteScheduleRow(id: number): Promise<void> {
  await query("DELETE FROM schedule WHERE id = ?", [id]);
}

export async function getSitemapSlugs(): Promise<{
  series: string[];
  genres: string[];
  nations: string[];
  years: string[];
  types: string[];
  episodes: { seriesSlug: string; episodeSlug: string }[];
}> {
  try {
    const [seriesRows, genreRows, nationRows, yearRows, typeRows, episodeRows] =
      await Promise.all([
        query<{ slug: string }[]>("SELECT slug FROM series"),
        query<{ slug: string }[]>("SELECT slug FROM genres"),
        query<{ slug: string }[]>("SELECT slug FROM nations"),
        query<{ name: string }[]>("SELECT name FROM years"),
        query<{ slug: string }[]>("SELECT slug FROM types"),
        query<{ series_slug: string; episode_slug: string }[]>(
          "SELECT s.slug AS series_slug, e.slug AS episode_slug FROM episodes e JOIN series s ON e.series_id = s.id"
        ),
      ]);
    return {
      series: Array.isArray(seriesRows) ? seriesRows.map((r) => r.slug) : [],
      genres: Array.isArray(genreRows) ? genreRows.map((r) => r.slug) : [],
      nations: Array.isArray(nationRows) ? nationRows.map((r) => r.slug) : [],
      years: Array.isArray(yearRows) ? yearRows.map((r) => r.name) : [],
      types: Array.isArray(typeRows) ? typeRows.map((r) => r.slug) : [],
      episodes: Array.isArray(episodeRows)
        ? episodeRows.map((r) => ({
            seriesSlug: r.series_slug,
            episodeSlug: r.episode_slug,
          }))
        : [],
    };
  } catch (error) {
    console.error("Error fetching sitemap slugs:", error);
    return {
      series: [],
      genres: [],
      nations: [],
      years: [],
      types: [],
      episodes: [],
    };
  }
}
