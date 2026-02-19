import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeriesCard from '@/components/SeriesCard';
import Banner from '@/components/Banner';
import { getBannerCode } from '@/lib/api';
import { generateCollectionPageSchema, generateSeriesListSchema, generateBreadcrumbSchema } from '@/lib/schema';
import Script from 'next/script';

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

interface Series {
  id: number;
  title: string;
  poster: string;
  story: string;
  slug: string;
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
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TypeData {
  id: number;
  menu_name: string;
  slug: string;
  category: Category[];
  series?: Series[];
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
    // First get the category slugs for this type
    const typeResponse = await fetch(
      `${API_URL}/items/navbar?filter[slug][_eq]=${slug}&fields=category.slug`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!typeResponse.ok) {
      throw new Error('Failed to fetch type data');
    }

    const typeData = await typeResponse.json();
    const categorySlugs = typeData.data[0]?.category?.map((cat: { slug: string }) => cat.slug) || [];

    if (!categorySlugs.length) {
      return 0;
    }

    // Then get the series count for these categories
    const response = await fetch(
      `${API_URL}/items/series?filter[category][slug][_in]=${categorySlugs.join(',')}&aggregate[count]=id`,
      {
        next: { revalidate: 60 },
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

async function getTypeData(slug: string, page: number = 1): Promise<TypeData | null> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    // First fetch the type data
    const typeResponse = await fetch(
      `${API_URL}/items/navbar?filter[slug][_eq]=${slug}&fields=id,menu_name,slug,category.id,category.name,category.slug`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!typeResponse.ok) {
      throw new Error('Failed to fetch type data');
    }

    const typeData = await typeResponse.json();
    const type = typeData.data[0];

    if (!type) {
      return null;
    }

    // Then fetch the series for this type's categories
    const categorySlugs = type.category.map((cat: Category) => cat.slug);
    const seriesResponse = await fetch(
      `${API_URL}/items/series?filter[category][slug][_in]=${categorySlugs.join(',')}&fields=id,title,poster,story,slug,imdb,duration,category.name,category.slug,nation.name,nation.slug,quality.name,quality.slug,year.name,year.slug&sort=-date_created&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!seriesResponse.ok) {
      throw new Error('Failed to fetch series data');
    }

    const seriesData = await seriesResponse.json();

    return {
      id: type.id,
      menu_name: type.menu_name,
      slug: type.slug,
      category: type.category,
      series: seriesData.data.map((series: Series) => ({
        id: series.id,
        title: series.title,
        poster: series.poster,
        story: series.story,
        slug: series.slug,
        imdb: series.imdb,
        duration: series.duration,
        category: series.category,
        nation: series.nation,
        quality: series.quality,
        year: series.year,
      })),
    };
  } catch (error) {
    console.error('Error fetching type data:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const typeData = await getTypeData(slug);

  if (!typeData) {
    return {
      title: 'Not Found',
      description: 'The requested type was not found.',
    };
  }

  const title = `${typeData.menu_name} - TUNREPLAY`;
  const description = `مشاهدة احدث ${typeData.menu_name} مترجمة اون لاين وتحميل مباشر بجودة عالية HD على موقع TUNREPLAY`;

  return {
    title,
    description,
    keywords: [
      typeData.menu_name,
      ...typeData.category.map(cat => cat.name),
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
      canonical: `/type/${typeData.slug}`,
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
      'twitter:label2': 'عدد الاقسام',
      'twitter:data2': typeData.category.length.toString(),
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  const [typeData, totalCount, bannerCode] = await Promise.all([
    getTypeData(slug, currentPage),
    getSeriesCount(slug),
    getBannerCode()
  ]);

  if (!typeData) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/' },
    { name: typeData.menu_name, url: `/type/${typeData.slug}` }
  ];

  const seriesList = typeData.series?.map(series => ({
    id: series.id,
    title: series.title,
    poster: series.poster,
    story: series.story,
    slug: series.slug,
    imdb: series.imdb,
    duration: series.duration,
    category: series.category,
    nation: series.nation,
    quality: series.quality,
    year: series.year
  })) || [];

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateCollectionPageSchema({
              name: typeData.menu_name,
              description: `مشاهدة احدث ${typeData.menu_name} مترجمة اون لاين`,
              url: `/type/${typeData.slug}`,
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

          <h1 className="text-3xl font-bold text-white mb-8">{typeData.menu_name}</h1>

          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-8">
            {typeData.category.map((category: Category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-black/20 hover:bg-black/40 text-white/80 hover:text-white px-4 py-2 rounded-lg transition"
              >
                {category.name}
              </a>
            ))}
          </div>
          
          {/* Series Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {seriesList.map((series: Series) => (
              <SeriesCard
                key={series.id}
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

          {(!seriesList || seriesList.length === 0) && (
            <p className="text-center text-white/60 py-12">
              لا توجد مسلسلات في هذا القسم حالياً
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <a
                  href={`/type/${slug}?page=${currentPage - 1}`}
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
                      href={`/type/${slug}?page=1`}
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
                      href={`/type/${slug}?page=${page}`}
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
                      href={`/type/${slug}?page=${totalPages}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      {totalPages}
                    </a>
                  </>
                )}
              </div>

              {currentPage < totalPages && (
                <a
                  href={`/type/${slug}?page=${currentPage + 1}`}
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