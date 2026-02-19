import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN;

// Force dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchAllSlugs() {
  try {
    const headers = {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'Cache-Control': 'no-cache'
    };

    const fetchOptions = {
      headers,
      next: { revalidate: 0 }  // Disable cache
    };

    const [series, episodes, genres, nations, years, types, categories] = await Promise.all([
      fetch(`${API_URL}/items/series?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
      fetch(`${API_URL}/items/episodes?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
      fetch(`${API_URL}/items/genre?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
      fetch(`${API_URL}/items/nation?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
      fetch(`${API_URL}/items/year?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
      fetch(`${API_URL}/items/navbar?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
      fetch(`${API_URL}/items/category?fields=slug&limit=-1`, fetchOptions).then(res => res.json()),
    ]);

    return {
      series: series.data?.map((item: { slug: string }) => item.slug) || [],
      episodes: episodes.data?.map((item: { slug: string }) => item.slug) || [],
      genres: genres.data?.map((item: { slug: string }) => item.slug) || [],
      nations: nations.data?.map((item: { slug: string }) => item.slug) || [],
      years: years.data?.map((item: { slug: string }) => item.slug) || [],
      types: types.data?.map((item: { slug: string }) => item.slug) || [],
      categories: categories.data?.map((item: { slug: string }) => item.slug) || [],
    };
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return {
      series: [],
      episodes: [],
      genres: [],
      nations: [],
      years: [],
      types: [],
      categories: [],
    };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchAllSlugs();

  // Static routes with encoded Arabic URLs
  const routes = [
    {
      url: 'https://tunreplay.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://tunreplay.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://tunreplay.com/dmca',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `https://tunreplay.com/${encodeURIComponent('مواعيد-الحلقات')}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap;

  // Dynamic routes with encoded slugs
  const seriesRoutes = slugs.series.map((slug: string) => ({
    url: `https://tunreplay.com/series/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const episodeRoutes = slugs.episodes.map((slug: string) => ({
    url: `https://tunreplay.com/episodes/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const genreRoutes = slugs.genres.map((slug: string) => ({
    url: `https://tunreplay.com/genre/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const nationRoutes = slugs.nations.map((slug: string) => ({
    url: `https://tunreplay.com/nation/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const yearRoutes = slugs.years.map((slug: string) => ({
    url: `https://tunreplay.com/year/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const typeRoutes = slugs.types.map((slug: string) => ({
    url: `https://tunreplay.com/type/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  const categoryRoutes = slugs.categories.map((slug: string) => ({
    url: `https://tunreplay.com/category/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    ...routes,
    ...seriesRoutes,
    ...episodeRoutes,
    ...genreRoutes,
    ...nationRoutes,
    ...yearRoutes,
    ...typeRoutes,
    ...categoryRoutes,
  ];
} 