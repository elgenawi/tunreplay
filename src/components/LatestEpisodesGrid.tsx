'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Episode {
  title: string;
  slug: string;
  episode_number: number;
  image: string | null;
  series_slug: string;
}

interface LatestEpisodesGridProps {
  episodes: Episode[];
}

export default function LatestEpisodesGrid({ episodes }: LatestEpisodesGridProps) {
  const limitedEpisodes = episodes.slice(0, 16);

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">أحدث الحلقات</h2>
        </div>

        {/* Mobile List */}
        <div className="sm:hidden space-y-4">
          {limitedEpisodes.map((episode, index) => (
            <Link key={`${episode.slug}-${index}`} href={`/series/${episode.series_slug}/episodes/${episode.slug}`}>
              <div className="justify-between mb-4 relative aspect-video rounded-lg overflow-hidden bg-white/5">
                {episode.image ? (
                  <Image
                    src={episode.image}
                    alt={episode.title}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    الحلقة {episode.episode_number}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
                  <p className="text-base font-medium text-white line-clamp-1 mb-1">{episode.title}</p>
                  <p className="text-sm text-white/80">الحلقة {episode.episode_number}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tablet and Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {limitedEpisodes.map((episode, index) => (
            <Link key={`${episode.slug}-${index}`} href={`/series/${episode.series_slug}/episodes/${episode.slug}`}>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                {episode.image ? (
                  <Image
                    src={episode.image}
                    alt={episode.title}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    الحلقة {episode.episode_number}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
                  <p className="text-base font-medium text-white line-clamp-1 mb-1">{episode.title}</p>
                  <p className="text-sm text-white/80">الحلقة {episode.episode_number}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
