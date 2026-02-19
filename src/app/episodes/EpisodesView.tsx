'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EpisodeCard from '@/components/EpisodeCard';

interface Episode {
  id: string;
  title: string;
  slug: string;
  number: string;
  cover: string;
  series: string;
  date_created: string;
}

interface EpisodesViewProps {
  episodes: Episode[];
}

export default function EpisodesView({ episodes }: EpisodesViewProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  // Calculate pagination
  const limit = 40;
  const totalPages = Math.ceil(episodes.length / limit);
  const offset = (currentPage - 1) * limit;

  // Get current page episodes
  const currentEpisodes = useMemo(() => {
    return episodes.slice(offset, offset + limit);
  }, [episodes, offset]);

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            أحدث الحلقات 
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              seriesSlug=""
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {currentPage > 1 && (
              <Link
                href={`/episodes?page=${currentPage - 1}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                السابق
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              {/* First page */}
              {currentPage > 2 && (
                <>
                  <Link
                    href="/episodes?page=1"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    1
                  </Link>
                  {currentPage > 3 && <span className="text-white/60">...</span>}
                </>
              )}

              {/* Current page and neighbors */}
              {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                .filter(page => page > 0 && page <= totalPages)
                .map(page => (
                  <Link
                    key={page}
                    href={`/episodes?page=${page}`}
                    className={`px-4 py-2 rounded-lg transition ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="text-white/60">...</span>}
                  <Link
                    href={`/episodes?page=${totalPages}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    {totalPages}
                  </Link>
                </>
              )}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/episodes?page=${currentPage + 1}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                التالي
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 