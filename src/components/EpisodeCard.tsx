import Image from 'next/image';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/api';
import type { Episode } from '@/app/series/[slug]/utils';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link href={`/episodes/${episode.slug}`} className="group">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={getAssetUrl(episode.cover)}
          alt={episode.title}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <svg
            className="w-12 h-12 text-white"
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
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white font-medium group-hover:text-primary transition">
          {episode.title}
        </h3>
        <p className="text-white/60 text-sm">الحلقة {episode.number}</p>
      </div>
    </Link>
  );
} 