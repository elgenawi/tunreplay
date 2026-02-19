'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getAssetUrl } from '@/lib/api';
import TrailerModal from '@/components/TrailerModal';
import EpisodeCard from '@/components/EpisodeCard';
import type { SeriesData, Episode } from './utils';

interface SeriesViewProps {
  series: SeriesData;
  episodes: Episode[];
  allEpisodes: Episode[];
  totalEpisodes: number;
  totalPages: number;
  currentPage: number;
}

export default function SeriesView({ 
  series, 
  episodes, 
  allEpisodes,
  totalEpisodes, 
  totalPages, 
  currentPage 
}: SeriesViewProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter episodes based on search term
  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) return episodes;

    const searchLower = searchTerm.toLowerCase();
    return allEpisodes.filter(episode => 
      episode.title.toLowerCase().includes(searchLower) ||
      episode.number.toString().includes(searchLower)
    );
  }, [allEpisodes, episodes, searchTerm]);

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden max-w-[300px] mx-auto">
              <Image
                src={getAssetUrl(series.poster)}
                alt={series.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{series.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm">
              {series.imdb && (
                <span className="bg-yellow-500/90 text-black px-3 py-1 rounded-full">
                  IMDB: {series.imdb}
                </span>
              )}
              {series.duration && (
                <span className="bg-white/10 text-white/90 px-3 py-1 rounded-full">
                  {series.duration}
                </span>
              )}
              {series.quality && (
                <span className="bg-primary/90 text-white px-3 py-1 rounded-full">
                  {series.quality.name}
                </span>
              )}
            </div>

            <p className="text-white/80 leading-relaxed">{series.story}</p>

            <div className="space-y-4">
              {/* Category & Year */}
              <div className="flex flex-wrap gap-2 text-sm">
                {series.category && (
                  <Link 
                    href={`/category/${series.category.slug}`}
                    className="text-white/60 hover:text-primary transition"
                  >
                    {series.category.name}
                  </Link>
                )}
                {series.year && (
                  <>
                    <span className="text-white/40">•</span>
                    <Link 
                      href={`/year/${series.year.slug}`}
                      className="text-white/60 hover:text-primary transition"
                    >
                      {series.year.name}
                    </Link>
                  </>
                )}
                {series.nation && (
                  <>
                    <span className="text-white/40">•</span>
                    <Link 
                      href={`/nation/${series.nation.slug}`}
                      className="text-white/60 hover:text-primary transition"
                    >
                      {series.nation.name}
                    </Link>
                  </>
                )}
              </div>

              {/* Genres */}
              {series.genres && series.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {series.genres.map(({ genre_id }) => (
                    <Link
                      key={genre_id.slug}
                      href={`/genre/${genre_id.slug}`}
                      className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm px-3 py-1 rounded-full transition"
                    >
                      {genre_id.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Trailer Button */}
            {series.trailer && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                مشاهدة الإعلان
              </button>
            )}
          </div>
        </div>

        {/* Episodes Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              الحلقات ({totalEpisodes})
            </h2>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن الحلقة..."
                className="w-full px-4 py-2 bg-white/5 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">لم يتم العثور على حلقات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {filteredEpisodes.map((episode) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  seriesSlug={series.slug}
                />
              ))}
            </div>
          )}

          {/* Show pagination only when not searching */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <Link
                  href={`/series/${series.slug}?page=${currentPage - 1}`}
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
                      href={`/series/${series.slug}?page=1`}
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
                      href={`/series/${series.slug}?page=${page}`}
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
                      href={`/series/${series.slug}?page=${totalPages}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      {totalPages}
                    </Link>
                  </>
                )}
              </div>

              {currentPage < totalPages && (
                <Link
                  href={`/series/${series.slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  التالي
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={series.trailer}
        title={series.title}
      />
    </main>
  );
} 