const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8055';

export interface Genre {
  genre_id: {
    name: string;
    slug: string;
  };
}

export interface SeriesData {
  id: string;
  title: string;
  poster: string;
  story: string;
  slug: string;
  trailer: string;
  imdb: string;
  duration: string;
  category: {
    name: string;
    slug: string;
  };
  nation: {
    name: string;
    slug: string;
  };
  quality: {
    name: string;
    slug: string;
  };
  year: {
    name: string;
    slug: string;
  };
  genres: Genre[];
  episodes: Episode[];
}

export async function getSeriesData(slug: string): Promise<SeriesData | null> {
  try {
    const response = await fetch(
      `${API_URL}/items/series?filter[slug][_eq]=${slug}&fields=id,title,poster,story,slug,trailer,imdb,duration,category.name,category.slug,nation.name,nation.slug,quality.name,quality.slug,year.name,year.slug,genres.genre_id.name,genres.genre_id.slug,episodes`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch series data');
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching series data:', error);
    return null;
  }
}

interface Episode {
  id: string;
  title: string;
  slug: string;
  number: string;
  cover: string;
  date_created: string;
}

interface EpisodesResponse {
  data: {
    id: string;
    title: string;
    slug: string;
    episodes: Episode[];
  }[];
}

export const getSeriesEpisodesData = async (slug: string, page: number = 1) => {
  try {
    // Get all episodes data in one request
    const episodesResponse = await fetch(
      `${API_URL}/items/series?filter[slug][_eq]=${slug}&fields=id,title,slug,episodes.id,episodes.title,episodes.slug,episodes.number,episodes.cover,episodes.date_created&deep={"episodes":{"_sort":["date_created"],"_limit":-1}}`,
      { next: { revalidate: 0 } }
    );
    const episodesData: EpisodesResponse = await episodesResponse.json();

    if (!episodesData.data.length) {
      throw new Error('Series not found');
    }

    const allEpisodes = episodesData.data[0]?.episodes || [];
    const totalEpisodes = allEpisodes.length;

    // Sort episodes by number (handling decimal numbers correctly)
    const sortedEpisodes = [...allEpisodes].sort((a, b) => {
      const numA = parseFloat(a.number);
      const numB = parseFloat(b.number);
      return numA - numB;
    });

    // Calculate pagination
    const limit = 40;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalEpisodes / limit);

    // Get episodes for current page
    const paginatedEpisodes = sortedEpisodes.slice(offset, offset + limit);

    return {
      episodes: paginatedEpisodes,
      totalPages,
      currentPage: page,
      totalEpisodes,
    };
  } catch (error) {
    console.error('Error fetching episodes data:', error);
    return {
      episodes: [],
      totalPages: 1,
      currentPage: page,
      totalEpisodes: 0,
    };
  }
};

export const getAllEpisodesData = async (slug: string) => {
  try {
    // Get all episodes data in one request
    const episodesResponse = await fetch(
      `${API_URL}/items/series?filter[slug][_eq]=${slug}&fields=id,title,slug,episodes.id,episodes.title,episodes.slug,episodes.number,episodes.cover,episodes.date_created&deep={"episodes":{"_sort":["date_created"],"_limit":-1}}`,
      { next: { revalidate: 0 } }
    );
    const episodesData: EpisodesResponse = await episodesResponse.json();

    if (!episodesData.data.length) {
      throw new Error('Series not found');
    }

    const allEpisodes = episodesData.data[0]?.episodes || [];

    // Sort episodes by number (handling decimal numbers correctly)
    const sortedEpisodes = [...allEpisodes].sort((a, b) => {
      const numA = parseFloat(a.number);
      const numB = parseFloat(b.number);
      return numA - numB;
    });

    return {
      episodes: sortedEpisodes,
    };
  } catch (error) {
    console.error('Error fetching all episodes data:', error);
    return {
      episodes: [],
    };
  }
};

export type { Episode }; 