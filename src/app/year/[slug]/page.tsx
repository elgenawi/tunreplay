import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeriesCard from '@/components/SeriesCard';
import Banner from '@/components/Banner';
import { getBannerCode } from '@/lib/api';
import { generateCollectionPageSchema, generateSeriesListSchema, generateBreadcrumbSchema } from '@/lib/schema';
import Script from 'next/script';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BEARER_TOKEN = process.env.NEXT_BEARER_TOKEN;

interface YearData {
  id: string;
  name: string;
  slug: string;
  series: Array<{
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
  }>;
}

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

const ITEMS_PER_PAGE = 20;

async function getSeriesCount(slug: string): Promise<number> {
  try {
    const response = await fetch(
      `${API_URL}/items/series?filter[year][slug][_eq]=${slug}&aggregate[count]=id`,
      {
        next: { revalidate: 60 },
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch series count');
    }

    const data = await response.json();
    return Number(data.data[0]?.count?.id) || 0;
  } catch (error) {
    console.error('Error fetching series count:', error);
    return 0;
  }
}

async function getYearData(slug: string, page: number = 1): Promise<YearData | null> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const deep = JSON.stringify({
      series: {
        _limit: ITEMS_PER_PAGE,
        _offset: offset,
        _sort: ["-date_created"]
      }
    });

    const fields = [
      'id',
      'name',
      'slug',
      'series.title',
      'series.poster',
      'series.story',
      'series.slug',
      'series.imdb',
      'series.duration',
      'series.category.name',
      'series.category.slug',
      'series.nation.name',
      'series.nation.slug',
      'series.quality.name',
      'series.quality.slug',
      'series.year.name',
      'series.year.slug'
    ].join(',');

    const response = await fetch(
      `${API_URL}/items/year?filter[slug][_eq]=${slug}&fields=${fields}&deep=${deep}`,
      {
        next: { revalidate: 60 },
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch year data');
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching year data:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const yearData = await getYearData(slug, 1);

  if (!yearData) {
    return {
      title: 'Not Found',
      description: 'The requested year was not found.',
    };
  }

  const title = `مسلسلات ${yearData.name} - TUNREPLAY`;
  const description = `مشاهدة احدث مسلسلات ${yearData.name} مترجمة اون لاين وتحميل مباشر بجودة عالية HD على موقع TUNREPLAY`;

  return {
    title,
    description,
    keywords: [
      yearData.name,
      'مسلسلات',
      'افلام',
      'مشاهدة',
      'تحميل',
      'اون لاين',
      'مترجم',
      'HD',
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
      type: 'website',
      siteName: 'TUNREPLAY',
      locale: 'ar_AR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@TUNREPLAY',
      site: '@TUNREPLAY',
    },
    alternates: {
      canonical: `/year/${yearData.slug}`,
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
      'twitter:label2': 'عدد المسلسلات',
      'twitter:data2': yearData.series?.length.toString() || '0',
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  const [yearData, totalCount, bannerCode] = await Promise.all([
    getYearData(slug, currentPage),
    getSeriesCount(slug),
    getBannerCode()
  ]);

  if (!yearData) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/' },
    { name: yearData.name, url: `/year/${yearData.slug}` }
  ];

  const seriesList = yearData.series?.map(series => ({
    title: series.title,
    poster: series.poster,
    story: series.story,
    slug: series.slug
  })) || [];

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateCollectionPageSchema({
              name: yearData.name,
              description: `مشاهدة احدث مسلسلات ${yearData.name} مترجمة اون لاين`,
              url: `/year/${yearData.slug}`,
              itemCount: totalCount
            }),
            generateSeriesListSchema(seriesList),
            generateBreadcrumbSchema(breadcrumbItems)
          ])
        }}
      />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="w-full mb-8">
            <Banner code={bannerCode} />
          </div>

          <h1 className="text-3xl font-bold text-white mb-8">{yearData.name}</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {yearData.series?.map((series, index) => (
              <SeriesCard
                key={`${series.slug}-${index}`}
                title={series.title}
                poster={series.poster}
                story={series.story}
                slug={series.slug}
                imdb={series.imdb}
                duration={series.duration}
                category={series.category}
                nation={series.nation}
                quality={series.quality}
                year={series.year}
              />
            ))}
          </div>

          {(!yearData.series || yearData.series.length === 0) && (
            <p className="text-center text-white/60 py-12">
              لا توجد مسلسلات في هذا القسم حالياً
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <a
                  href={`/year/${slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  السابق
                </a>
              )}
              
              <div className="flex items-center gap-2">
                {/* First page */}
                {currentPage > 2 && (
                  <>
                    <a
                      href={`/year/${slug}?page=1`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      1
                    </a>
                    {currentPage > 3 && <span className="text-white/60">...</span>}
                  </>
                )}

                {/* Current page and neighbors */}
                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter(page => page > 0 && page <= totalPages)
                  .map(page => (
                    <a
                      key={page}
                      href={`/year/${slug}?page=${page}`}
                      className={`px-4 py-2 rounded-lg transition ${
                        page === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {page}
                    </a>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="text-white/60">...</span>}
                    <a
                      href={`/year/${slug}?page=${totalPages}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      {totalPages}
                    </a>
                  </>
                )}
              </div>

              {currentPage < totalPages && (
                <a
                  href={`/year/${slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  التالي
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
} 