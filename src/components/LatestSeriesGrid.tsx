'use client';

import Link from 'next/link';
import SeriesCard from './SeriesCard';

interface Series {
  title: string;
  story: string;
  slug: string;
  poster: string;
  imdb: string | null;
  duration: string | null;
}

interface LatestSeriesGridProps {
  series: Series[];
}

export default function LatestSeriesGrid({ series }: LatestSeriesGridProps) {
  return (
    <section className="py-6 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">أحدث المسلسلات</h2>
          <Link
            href="/type/مسلسلات"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition text-sm"
          >
            عرض الكل
          </Link>
        </div>

        {/* Mobile List */}
        <div className="sm:hidden space-y-4">
          {series.map((item, index) => (
            <SeriesCard
              key={`${item.slug}-${index}`}
              title={item.title}
              poster={item.poster}
              story={item.story}
              slug={item.slug}
              imdb={item.imdb}
              duration={item.duration}
            />
          ))}
        </div>

        {/* Tablet and Desktop Grid */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {series.map((item, index) => (
            <SeriesCard
              key={`${item.slug}-${index}`}
              title={item.title}
              poster={item.poster}
              story={item.story}
              slug={item.slug}
              imdb={item.imdb}
              duration={item.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 