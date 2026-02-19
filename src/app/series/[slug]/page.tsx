import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSeriesData, getSeriesEpisodes, getAllEpisodes } from './utils';
import SeriesView from './SeriesView';

interface SeriesPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function decodeSlug(segment: string): string {
  try {
    if (segment.includes("%")) return decodeURIComponent(segment);
    return segment;
  } catch {
    return segment;
  }
}

export async function generateMetadata(
  { params }: SeriesPageProps,
): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const series = await getSeriesData(slug);

  if (!series) {
    return { title: 'Not Found', description: 'The page you are looking for does not exist.' };
  }

  const title = `${series.title} - TUNREPLAY`;
  const description = `مشاهدة وتحميل ${series.title} مترجم كامل بجودة HD اون لاين وتحميل مباشر`;

  return {
    title,
    description,
    keywords: [
      series.type_name,
      series.nation_name,
      series.year_name,
      ...series.genres.map((g) => g.name),
      'مشاهدة',
      'اون لاين',
      'مترجم',
      'تحميل',
      'HD',
    ].filter(Boolean) as string[],
    authors: [{ name: 'TUNREPLAY' }],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title,
      description,
      type: 'video.movie',
      images: series.image ? [series.image] : [],
      siteName: 'TUNREPLAY',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: series.image ? [series.image] : [],
    },
    alternates: { canonical: `/series/${series.slug}` },
    other: {
      'og:locale': 'ar_AR',
      'og:type': 'article',
      ...(series.year_name && { 'og:video:release_date': series.year_name }),
      ...(series.duration && { 'og:video:duration': series.duration }),
      'revisit-after': '1 hour',
      distribution: 'Global',
      rating: 'General',
      'content-language': 'ar-eg',
    },
  };
}

export default async function SeriesPage({ params, searchParams }: SeriesPageProps) {
  const { slug: rawSlug } = await params;
  const { page } = await searchParams;
  const slug = decodeSlug(rawSlug);
  const currentPage = Number(page) || 1;

  const series = await getSeriesData(slug);
  if (!series) notFound();

  const [episodesData, allEpisodes] = await Promise.all([
    getSeriesEpisodes(series.id, currentPage),
    getAllEpisodes(series.id),
  ]);

  return (
    <SeriesView
      series={series}
      episodes={episodesData.episodes}
      allEpisodes={allEpisodes}
      totalEpisodes={episodesData.totalEpisodes}
      totalPages={episodesData.totalPages}
      currentPage={episodesData.currentPage}
    />
  );
}
