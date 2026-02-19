import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAssetUrl } from '@/lib/api';
import { getBannerCode } from '@/lib/api';
import Banner from '@/components/Banner';
import EpisodeView from './EpisodeView';
import { generateEpisodeSchema, generateBreadcrumbSchema } from '@/lib/schema';
import Script from 'next/script';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Source {
  id: string;
  type: string;
  title: string;
  source: string;
  date_created: string;
  date_updated: string;
  Episode: string;
}

interface Download {
  id: number;
  name: string;
  link: string;
  date_created: string;
  date_updated: string;
  episode: string;
}

interface Episode {
  id: string;
  title: string;
  slug: string;
  number: string;
  cover: string;
  date_created: string;
  series: {
    id: string;
    title: string;
    slug: string;
  };
  sources: Source[];
  downlaod: Download[];
}

interface SeriesEpisode {
  title: string;
  slug: string;
  number: string;
  date_created: string;
}

interface SeriesData {
  id: string;
  title: string;
  slug: string;
  episodes: SeriesEpisode[];
}

async function getEpisodeData(slug: string): Promise<Episode | null> {
  try {
    const response = await fetch(
      `${API_URL}/items/episodes?filter[slug][_eq]=${slug}&fields=id,title,slug,number,cover,series.id,series.title,series.slug,sources.*,downlaod.*,date_created`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch episode');
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching episode:', error);
    return null;
  }
}

async function getSeriesEpisodes(seriesSlug: string): Promise<SeriesEpisode[]> {
  try {
    const response = await fetch(
      `${API_URL}/items/series?filter[slug][_eq]=${seriesSlug}&fields=id,title,slug,episodes.title,episodes.slug,episodes.number,episodes.date_created&deep={"episodes":{"_sort":["date_created"],"_limit":-1}}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch series episodes');
    }

    const data = await response.json();
    const seriesData: SeriesData = data.data[0];

    if (!seriesData) {
      return [];
    }

    // Sort episodes by number (handling decimal numbers correctly)
    return [...seriesData.episodes].sort((a, b) => {
      const numA = parseFloat(a.number);
      const numB = parseFloat(b.number);
      return numA - numB;
    });
  } catch (error) {
    console.error('Error fetching series episodes:', error);
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const episode = await getEpisodeData(slug);

  if (!episode) {
    return {
      title: 'Not Found',
      description: 'The requested episode was not found.',
    };
  }

  const title = `${episode.series.title} الحلقة ${episode.number} مترجمة - TUNREPLAY`;
  const description = `مشاهدة وتحميل الحلقة ${episode.number} من ${episode.series.title} مترجم بجودة HD اون لاين وتحميل مباشر`;
  const imageUrl = getAssetUrl(episode.cover);

  return {
    title,
    description,
    keywords: [
      'مشاهدة',
      'تحميل',
      'اون لاين',
      'مترجم',
      'HD',
      episode.series.title,
      `الحلقة ${episode.number}`,
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'video.episode',
      siteName: 'TUNREPLAY',
      locale: 'ar_AR',
      images: [
        {
          url: imageUrl,
          width: 900,
          height: 1586,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@TUNREPLAY',
      site: '@TUNREPLAY',
    },
    alternates: {
      canonical: `/episodes/${episode.slug}`,
    },
    other: {
      'revisit-after': '1 hour',
      'distribution': 'Global',
      'rating': 'General',
      'content-language': 'ar-eg',
      'resource-type': 'document',
      'Cache-Control': 'no-cache',
      'apple-mobile-web-app-capable': 'yes',
      'theme-color': '#ed3c3c',
      'msapplication-navbutton-color': '#ed3c3c',
      'apple-mobile-web-app-status-bar-style': '#ed3c3c',
      'twitter:label1': 'كُتب بواسطة',
      'twitter:data1': 'TUNREPLAY',
      'twitter:label2': 'مدة القراءة',
      'twitter:data2': 'أقل من دقيقة',
    },
  };
}

export default async function EpisodePage({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params);
  
  const [episode, bannerCode] = await Promise.all([
    getEpisodeData(slug),
    getBannerCode()
  ]);

  if (!episode) {
    notFound();
  }

  // Get all episodes for the series
  const allEpisodes = await getSeriesEpisodes(episode.series.slug);

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/' },
    { name: episode.series.title, url: `/series/${episode.series.slug}` },
    { name: `الحلقة ${episode.number}`, url: `/episodes/${episode.slug}` }
  ];

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateEpisodeSchema(episode),
            generateBreadcrumbSchema(breadcrumbItems)
          ])
        }}
      />
      <div>
        <div className="w-full pt-16 md:pt-20">
          <Banner code={bannerCode} />
        </div>
        <EpisodeView episode={episode} allEpisodes={allEpisodes} />
      </div>
    </>
  );
} 