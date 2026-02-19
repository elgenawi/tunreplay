'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
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
  currentPage,
}: SeriesViewProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) return episodes;
    const searchLower = searchTerm.toLowerCase();
    return allEpisodes.filter(
      (ep) =>
        ep.title.toLowerCase().includes(searchLower) ||
        ep.episode_number.toString().includes(searchLower)
    );
  }, [allEpisodes, episodes, searchTerm]);

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden max-w-[300px] mx-auto">
              {series.image ? (
                <Image
                  src={series.image}
                  alt={series.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/40">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{series.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm">
              {series.duration && (
                <span className="bg-white/10 text-white/90 px-3 py-1 rounded-full">
                  {series.duration}
                </span>
              )}
              {series.source && (
                <span className="bg-primary/90 text-white px-3 py-1 rounded-full">
                  {series.source}
                </span>
              )}
              {series.episodes_number && (
                <span className="bg-white/10 text-white/90 px-3 py-1 rounded-full">
                  {series.episodes_number} حلقة
                </span>
              )}
              {series.season && (
                <span className="bg-white/10 text-white/90 px-3 py-1 rounded-full">
                  الموسم {series.season}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Type, Year, Nation */}
              <div className="flex flex-wrap gap-2 text-sm">
                {series.type_name && (
                  <Link
                    href={`/type/${series.type_slug}`}
                    className="text-white/60 hover:text-primary transition"
                  >
                    {series.type_name}
                  </Link>
                )}
                {series.year_name && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{series.year_name}</span>
                  </>
                )}
                {series.nation_name && (
                  <>
                    <span className="text-white/40">•</span>
                    <Link
                      href={`/nation/${series.nation_slug}`}
                      className="text-white/60 hover:text-primary transition"
                    >
                      {series.nation_name}
                    </Link>
                  </>
                )}
                {series.status_name && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{series.status_name}</span>
                  </>
                )}
              </div>

              {/* Genres */}
              {series.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {series.genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      href={`/genre/${genre.slug}`}
                      className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm px-3 py-1 rounded-full transition"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Trailer Button */}
            {series.trailer_embed_vid && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <EpisodeCard key={episode.id} episode={episode} seriesSlug={series.slug} />
              ))}
            </div>
          )}

          {/* Pagination */}
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

                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter((p) => p > 0 && p <= totalPages)
                  .map((p) => (
                    <Link
                      key={p}
                      href={`/series/${series.slug}?page=${p}`}
                      className={`px-4 py-2 rounded-lg transition ${
                        p === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}

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

      {series.trailer_embed_vid && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          trailerUrl={series.trailer_embed_vid}
          title={series.title}
        />
      )}
    </main>
  );
}
