import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SeriesCard from "@/components/SeriesCard";
import HomeAdBanner from "@/components/HomeAdBanner";
import Script from "next/script";
import {
  getTypeBySlug,
  getSeriesByTypeSlug,
  getSeriesCountByTypeSlug,
} from "@/lib/queries";
import { generateCollectionPageSchema, generateSeriesListSchema, generateBreadcrumbSchema } from "@/lib/schema";

const ITEMS_PER_PAGE = 20;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const type = await getTypeBySlug(slug);
  if (!type) {
    return { title: "Not Found", description: "The requested type was not found." };
  }
  const title = `${type.name} - TUNREPLAY`;
  const description = `مشاهدة احدث ${type.name} مترجمة اون لاين وتحميل مباشر بجودة عالية HD على موقع TUNREPLAY`;
  return {
    title,
    description,
    keywords: [type.name, "مسلسلات", "افلام", "مشاهدة", "تحميل", "اون لاين", "مترجم", "HD"],
    robots: { index: true, follow: true },
    openGraph: { title, description, type: "website", siteName: "TUNREPLAY", locale: "ar_AR" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/type/${type.slug}` },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  const [type, series, totalCount] = await Promise.all([
    getTypeBySlug(slug),
    getSeriesByTypeSlug(slug, currentPage),
    getSeriesCountByTypeSlug(slug),
  ]);

  if (!type) notFound();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  if (currentPage > totalPages && totalPages > 0) notFound();

  const breadcrumbItems = [
    { name: "الرئيسية", url: "/" },
    { name: type.name, url: `/type/${type.slug}` },
  ];

  const seriesList = series.map((s) => ({
    id: s.id,
    title: s.title,
    image: s.image,
    slug: s.slug,
    duration: s.duration,
    source: s.source,
    year_name: s.year_name,
    nation_name: s.nation_name,
    nation_slug: s.nation_slug,
    poster: s.image,
    story: "",
  }));

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateCollectionPageSchema({
              name: type.name,
              description: `مشاهدة احدث ${type.name} مترجمة اون لاين`,
              url: `/type/${type.slug}`,
              itemCount: totalCount,
            }),
            generateSeriesListSchema(seriesList),
            generateBreadcrumbSchema(breadcrumbItems),
          ]),
        }}
      />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">{type.name}</h1>

          <HomeAdBanner />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {series.map((s) => (
              <SeriesCard
                key={s.id}
                title={s.title}
                image={s.image}
                slug={s.slug}
                duration={s.duration}
                source={s.source}
                year_name={s.year_name}
                nation_name={s.nation_name}
                nation_slug={s.nation_slug}
              />
            ))}
          </div>

          {series.length === 0 && (
            <p className="text-center text-white/60 py-12">لا توجد مسلسلات في هذا القسم حالياً</p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <Link
                  href={`/type/${slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  السابق
                </Link>
              )}
              <span className="text-white/80 px-2">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/type/${slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  التالي
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
