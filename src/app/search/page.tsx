import { searchSeries } from '@/lib/actions';
import SeriesCard from '@/components/SeriesCard';
import Link from 'next/link';
import { checkRateLimit } from '@/lib/rateLimit';

const ITEMS_PER_PAGE = 12;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; page: string };
}) {
  const query = searchParams.q || '';
  const currentPage = Number(searchParams.page) || 1;

  try {
    // Check rate limit before processing the search
    checkRateLimit();

    const { data: searchResults, meta } = await searchSeries(
      query,
      currentPage,
      ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(meta.total_count / ITEMS_PER_PAGE);

    return (
      <main className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">نتائج البحث: {query}</h1>
          <p className="text-white/60">
            {meta.total_count} نتيجة
          </p>
        </div>

        {searchResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {searchResults.map((series) => (
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

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    السابق
                  </Link>
                )}
                
                <span className="text-white/60">
                  صفحة {currentPage} من {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    التالي
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              لا توجد نتائج للبحث
            </p>
            <p className="text-white/40 mt-2">
              حاول البحث بكلمات مختلفة
            </p>
          </div>
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="container mx-auto px-4 py-20">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">
            {error instanceof Error ? error.message : 'حدث خطأ في البحث. الرجاء المحاولة مرة أخرى لاحقاً.'}
          </p>
        </div>
      </main>
    );
  }
} 