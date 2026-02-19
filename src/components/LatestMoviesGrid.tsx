'use client';

import Link from 'next/link';
import SeriesCard from './SeriesCard';

interface Series {
  title: string;
  slug: string;
  image: string | null;
  duration: string | null;
  source: string | null;
  year_name: string | null;
  nation_name: string | null;
  nation_slug: string | null;
}

interface LatestMoviesGridProps {
  series: Series[];
}

export default function LatestMoviesGrid({ series }: LatestMoviesGridProps) {
  return (
    <section className="py-6 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">أحدث الأفلام</h2>
          <Link
            href="/type/افلام"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition text-sm"
          >
            عرض الكل
          </Link>
        </div>

        <div className="sm:hidden space-y-4">
          {series.map((item, index) => (
            <SeriesCard
              key={`${item.slug}-${index}`}
              title={item.title}
              image={item.image}
              slug={item.slug}
              duration={item.duration}
              source={item.source}
              year_name={item.year_name}
              nation_name={item.nation_name}
              nation_slug={item.nation_slug}
            />
          ))}
        </div>

        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {series.map((item, index) => (
            <SeriesCard
              key={`${item.slug}-${index}`}
              title={item.title}
              image={item.image}
              slug={item.slug}
              duration={item.duration}
              source={item.source}
              year_name={item.year_name}
              nation_name={item.nation_name}
              nation_slug={item.nation_slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
