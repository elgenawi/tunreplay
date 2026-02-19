import Image from 'next/image';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/api';

interface SeriesCardProps {
  title: string;
  poster: string;
  slug: string;
  story?: string;
  imdb?: string | null;
  duration?: string | null;
  nation?: {
    name: string;
    slug: string;
  } | null;
  quality?: {
    name: string;
    slug: string;
  } | null;
  year?: {
    name: string;
    slug: string;
  } | null;
}

export default function SeriesCard({
  title,
  poster,
  story,
  slug,
  imdb,
  duration,
  nation,
  quality,
  year
}: SeriesCardProps) {
  return (
    <div className="group relative bg-black/20 rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={getAssetUrl(poster)}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-sm text-white/90 line-clamp-3 mb-2">{story}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {imdb && (
              <span className="bg-yellow-500/90 text-black px-2 py-1 rounded">
                IMDB: {imdb}
              </span>
            )}
            {duration && (
              <span className="bg-white/10 text-white/90 px-2 py-1 rounded">
                {duration}
              </span>
            )}
            {quality && (
              <span className="bg-primary/90 text-white px-2 py-1 rounded">
                {quality.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          {year && (
            <>
              <Link href={`/year/${year.slug}`} className="hover:text-primary">
                {year.name}
              </Link>
              <span>•</span>
            </>
          )}
          {nation && (
            <Link href={`/nation/${nation.slug}`} className="hover:text-primary">
              {nation.name}
            </Link>
          )}
        </div>
      </div>

      {/* Full Card Link */}
      <Link href={`/series/${slug}`} className="absolute inset-0">
        <span className="sr-only">View {title}</span>
      </Link>
    </div>
  );
} 