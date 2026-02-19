'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8055';

export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  story: string;
  slug: string;
  imdb: string | null;
  duration: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
  nation: {
    name: string;
    slug: string;
  } | null;
  quality: {
    name: string;
    slug: string;
  } | null;
  year: {
    name: string;
    slug: string;
  } | null;
}

export interface SearchResponse {
  data: SearchResult[];
  meta: {
    total_count: number;
  };
}

export async function searchSeries(query: string, page: number, limit: number): Promise<SearchResponse> {
  try {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${API_URL}/items/series?search=${encodeURIComponent(query)}&fields=id,title,poster,story,slug,imdb,duration,category.name,category.slug,nation.name,nation.slug,quality.name,quality.slug,year.name,year.slug&sort=-date_created&limit=${limit}&offset=${offset}`,
      { 
        next: { revalidate: 0 },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    return {
      data: data.data || [],
      meta: {
        total_count: data.meta?.total_count || 0
      }
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      data: [],
      meta: {
        total_count: 0
      }
    };
  }
}
