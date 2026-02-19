import { notFound } from 'next/navigation';
import SeriesCard from '@/components/SeriesCard';
import Banner from '@/components/Banner';
import HomeAdBanner from '@/components/HomeAdBanner';
import { getBannerCode } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8055';

interface CategoryData {
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
      `${API_URL}/items/series?filter[category][slug][_eq]=${slug}&aggregate[count]=id`,
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

async function getCategoryData(slug: string, page: number = 1): Promise<CategoryData | null> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const deep = JSON.stringify({
      series: {
        _limit: ITEMS_PER_PAGE,
        _offset: offset,
        sort: "-date_created"
      }
    });

    const response = await fetch(
      `${API_URL}/items/category?filter[slug][_eq]=${slug}&fields=id,name,slug,series.title,series.poster,series.story,series.slug,series.imdb,series.duration,series.category.name,series.category.slug,series.nation.name,series.nation.slug,series.quality.name,series.quality.slug,series.year.name,series.year.slug&deep=${deep}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch category data');
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  // Await both params and searchParams before using
  const { slug } = await Promise.resolve(params);
  const { page } = await Promise.resolve(searchParams);
  const currentPage = Number(page) || 1;

  const [categoryData, totalCount, bannerCode] = await Promise.all([
    getCategoryData(slug, currentPage),
    getSeriesCount(slug),
    getBannerCode()
  ]);

  if (!categoryData) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="w-full mb-8">
          <Banner code={bannerCode} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-8">{categoryData.name}</h1>

        <HomeAdBanner />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categoryData.series?.map((series) => (
            <SeriesCard
              key={series.slug}
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

        {(!categoryData.series || categoryData.series.length === 0) && (
          <p className="text-center text-white/60 py-12">
            لا توجد مسلسلات في هذا القسم حالياً
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {currentPage > 1 && (
              <a
                href={`/category/${slug}?page=${currentPage - 1}`}
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
                    href={`/category/${slug}?page=1`}
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
                    href={`/category/${slug}?page=${page}`}
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
                    href={`/category/${slug}?page=${totalPages}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    {totalPages}
                  </a>
                </>
              )}
            </div>

            {currentPage < totalPages && (
              <a
                href={`/category/${slug}?page=${currentPage + 1}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                التالي
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 
