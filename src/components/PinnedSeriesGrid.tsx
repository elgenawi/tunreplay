'use client';

import SeriesCard from './SeriesCard';
import { useRef } from 'react';

interface PinnedSeriesGridProps {
  series: Array<{
    title: string;
    poster: string;
    slug: string;
  }>;
}

export default function PinnedSeriesGrid({ series }: PinnedSeriesGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Take only the first 6 series
  const limitedSeries = series.slice(0, 6);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * (direction === 'left' ? -0.8 : 0.8);
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">سلاسل مثبتة</h2>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory scroll-smooth mb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {limitedSeries.map((series, index) => (
              <div key={`${series.slug}-${index}`} className="flex-none w-[160px] snap-start">
                <SeriesCard
                  title={series.title}
                  poster={series.poster}
                  slug={series.slug}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => scroll('right')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => scroll('left')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {limitedSeries.map((series, index) => (
            <SeriesCard
              key={`${series.slug}-${index}`}
              title={series.title}
              poster={series.poster}
              slug={series.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 