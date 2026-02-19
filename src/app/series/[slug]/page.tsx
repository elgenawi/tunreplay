import { Metadata, ResolvingMetadata } from 'next';
import { getAssetUrl } from '@/lib/api';
import { getBannerCode } from '@/lib/api';
import { getSeriesData, getSeriesEpisodesData, getAllEpisodesData } from './utils';
import { notFound } from 'next/navigation';
import SeriesView from './SeriesView';
import Banner from '@/components/Banner';

interface SeriesPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata(
  { params }: SeriesPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const seriesData = await getSeriesData(slug);

  if (!seriesData) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const seriesPoster = getAssetUrl(seriesData.poster);
  const title = `${seriesData.title} - TUNREPLAY`;
  const description = `مشاهدة وتحميل ${seriesData.title} مترجم كامل بجودة HD اون لاين وتحميل مباشر`;

  return {
    title,
    description,
    keywords: [
      seriesData.category?.name,
      seriesData.nation?.name,
      seriesData.year?.name,
      ...seriesData.genres.map(g => g.genre_id.name),
      'مشاهدة',
      'اون لاين',
      'مترجم',
      'تحميل',
      'HD'
    ].filter(Boolean),
    authors: [{ name: 'TUNREPLAY' }],
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
      type: 'video.movie',
      images: [seriesPoster, ...previousImages],
      videos: seriesData.trailer ? [seriesData.trailer] : [],
      siteName: 'TUNREPLAY',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seriesPoster],
    },
    alternates: {
      canonical: `/series/${seriesData.slug}`,
    },
    other: {
      'og:locale': 'ar_AR',
      'og:type': 'article',
      'og:video:release_date': seriesData.year?.name,
      'og:video:duration': seriesData.duration,
      'og:video:rating': seriesData.imdb,
      'revisit-after': '1 hour',
      'distribution': 'Global',
      'rating': 'General',
      'content-language': 'ar-eg',
    },
  };
}

export default async function SeriesPage({ params, searchParams }: SeriesPageProps) {
  const { slug } = await Promise.resolve(params);
  const { page } = await Promise.resolve(searchParams);
  const currentPage = Number(page) || 1;
  
  const [seriesData, episodesData, allEpisodesData, bannerCode] = await Promise.all([
    getSeriesData(slug),
    getSeriesEpisodesData(slug, currentPage),
    getAllEpisodesData(slug),
    getBannerCode()
  ]);

  if (!seriesData) {
    notFound();
  }

  return (
    <div>
      <div className="w-full pt-16 md:pt-20">
        <Banner code={bannerCode} />
      </div>
      <SeriesView 
        series={seriesData} 
        episodes={episodesData.episodes}
        allEpisodes={allEpisodesData.episodes}
        totalEpisodes={episodesData.totalEpisodes}
        totalPages={episodesData.totalPages}
        currentPage={episodesData.currentPage}
      />
    </div>
  );
} 
