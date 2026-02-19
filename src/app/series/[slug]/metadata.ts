import type { Metadata, ResolvingMetadata } from 'next';
import { getAssetUrl } from '@/lib/api';
import { getSeriesData } from './utils';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const seriesData = await getSeriesData(params.slug);

  if (!seriesData) {
    return {
      title: 'Not Found',
      description: 'The requested series was not found.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: seriesData.title,
    description: seriesData.story,
    openGraph: {
      title: seriesData.title,
      description: seriesData.story,
      type: 'video.movie',
      images: [getAssetUrl(seriesData.poster), ...previousImages],
      videos: seriesData.trailer ? [seriesData.trailer] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seriesData.title,
      description: seriesData.story,
      images: [getAssetUrl(seriesData.poster)],
    },
    alternates: {
      canonical: `/series/${seriesData.slug}`,
    },
    keywords: [
      seriesData.category?.name,
      seriesData.nation?.name,
      seriesData.year?.name,
      ...seriesData.genres.map(g => g.genre_id.name),
      'مشاهدة',
      'اون لاين',
      'مترجم',
    ].filter(Boolean),
    authors: [{ name: 'TUNREPLAY' }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    other: {
      'og:video:release_date': seriesData.year?.name,
      'og:video:duration': seriesData.duration,
      'og:video:rating': seriesData.imdb,
    },
  };
} 