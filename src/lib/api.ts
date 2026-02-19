const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8055';
const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN;

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MenuItem {
  id: number;
  menu_name: string;
  slug: string;
  category: Category[];
}

export interface PinnedSeries {
  title: string;
  poster: string;
  slug: string;
}

export interface SocialMedia {
  id: number;
  name: string;
  link: string;
  date_created: string;
  date_updated: string | null;
}

// Fallback data in case the API is not available
const fallbackMenuItems: MenuItem[] = [
  {
    id: 1,
    menu_name: "افلام",
    slug: "movies",
    category: [
      {
        id: "1",
        name: "افلام اجنبي",
        slug: "foreign-movies"
      }
    ]
  },
  {
    id: 2,
    menu_name: "مسلسلات",
    slug: "series",
    category: [
      {
        id: "2",
        name: "مسلسلات اجنبي",
        slug: "foreign-series"
      }
    ]
  }
];

// Add a helper function to create headers with bearer token
const getHeaders = () => ({
  'Accept': 'application/json',
  'Authorization': `Bearer ${BEARER_TOKEN}`,
});

export async function getNavItems(): Promise<MenuItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${API_URL}/items/navbar?fields=id,menu_name,slug,category.id,category.name,category.slug`,
      { 
        next: { revalidate: 3 },
        headers: getHeaders(),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('API response error:', response.status, response.statusText);
      return fallbackMenuItems;
    }

    const data = await response.json();
    return data.data || fallbackMenuItems;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching navigation items:', {
        message: error.message,
        cause: error.cause,
      });
    } else {
      console.error('Unknown error fetching navigation items:', error);
    }
    return fallbackMenuItems;
  }
}

export async function getPinnedSeries(): Promise<PinnedSeries[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${API_URL}/items/series?filter[pinned][_eq]=true&fields=title,poster,slug`,
      { 
        next: { revalidate: 10 },
        headers: getHeaders(),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('API response error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching pinned series:', {
        message: error.message,
        cause: error.cause,
      });
    } else {
      console.error('Unknown error fetching pinned series:', error);
    }
    return [];
  }
}

export async function getSocialMedia(): Promise<SocialMedia[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${API_URL}/items/Social_Media`,
      { 
        next: { revalidate: 60 },
        headers: getHeaders(),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('API response error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching social media:', {
        message: error.message,
        cause: error.cause,
      });
    } else {
      console.error('Unknown error fetching social media:', error);
    }
    return [];
  }
}

export function getAssetUrl(assetId: string): string {
  return `${API_URL}/assets/${assetId}`;
}

export async function getBannerCode(): Promise<string> {
  try {
    const response = await fetch(
      `${API_URL}/items/banner`,
      { 
        next: { revalidate: 60 },
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      console.error('API response error:', response.status, response.statusText);
      return '';
    }

    const data = await response.json();
    return data.data?.[0]?.code || '';
  } catch (error) {
    console.error('Error fetching banner:', error);
    return '';
  }
}

export async function getLatestEpisodes() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/episodes?fields=title,slug,number,cover&sort=-date_created&limit=16`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_BEARER_TOKEN}`
        },
        next: { revalidate: 10 } // Cache for 10 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch latest episodes');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching latest episodes:', error);
    return [];
  }
}

export async function getLatestSeries() {
  try {
    // First, get the category IDs for مسلسلات
    const navResponse = await fetch(
      `${API_URL}/items/navbar?fields=category&filter[slug][_eq]=مسلسلات`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }
      }
    );

    if (!navResponse.ok) {
      throw new Error('Failed to fetch category IDs');
    }

    const navData = await navResponse.json();
    const categoryIds = navData.data[0]?.category || [];

    if (!categoryIds.length) {
      return [];
    }

    // Then, fetch the latest series from these categories
    const seriesResponse = await fetch(
      `${API_URL}/items/series?fields=title,story,slug,poster,imdb,duration&filter[category][_in]=${categoryIds.join(',')}&sort=-date_created&limit=6`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }
      }
    );

    if (!seriesResponse.ok) {
      throw new Error('Failed to fetch latest series');
    }

    const seriesData = await seriesResponse.json();
    return seriesData.data;
  } catch (error) {
    console.error('Error fetching latest series:', error);
    return [];
  }
}

export async function getLatestMovies() {
  try {
    // First, get the category IDs for افلام
    const navResponse = await fetch(
      `${API_URL}/items/navbar?fields=category&filter[slug][_eq]=افلام`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }
      }
    );

    if (!navResponse.ok) {
      throw new Error('Failed to fetch category IDs');
    }

    const navData = await navResponse.json();
    const categoryIds = navData.data[0]?.category || [];

    if (!categoryIds.length) {
      return [];
    }

    // Then, fetch the latest movies from these categories
    const moviesResponse = await fetch(
      `${API_URL}/items/series?fields=title,story,slug,poster,imdb,duration&filter[category][_in]=${categoryIds.join(',')}&sort=-date_created&limit=6`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }
      }
    );

    if (!moviesResponse.ok) {
      throw new Error('Failed to fetch latest movies');
    }

    const moviesData = await moviesResponse.json();
    return moviesData.data;
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    return [];
  }
}

export async function getLatestAnime() {
  try {
    // First, get the category IDs for انمي
    const navResponse = await fetch(
      `${API_URL}/items/navbar?fields=category&filter[slug][_eq]=انمي`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }
      }
    );

    if (!navResponse.ok) {
      throw new Error('Failed to fetch category IDs');
    }

    const navData = await navResponse.json();
    const categoryIds = navData.data[0]?.category || [];

    if (!categoryIds.length) {
      return [];
    }

    // Then, fetch the latest anime from these categories
    const animeResponse = await fetch(
      `${API_URL}/items/series?fields=title,story,slug,poster,imdb,duration&filter[category][_in]=${categoryIds.join(',')}&sort=-date_created&limit=6`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 }
      }
    );

    if (!animeResponse.ok) {
      throw new Error('Failed to fetch latest anime');
    }

    const animeData = await animeResponse.json();
    return animeData.data;
  } catch (error) {
    console.error('Error fetching latest anime:', error);
    return [];
  }
} 