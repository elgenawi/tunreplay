import Image from 'next/image';
import Link from 'next/link';

interface SeriesCardProps {
  title: string;
  image: string | null;
  slug: string;
  duration?: string | null;
  source?: string | null;
  year_name?: string | null;
  nation_name?: string | null;
  nation_slug?: string | null;
}

export default function SeriesCard({
  title,
  image,
  slug,
  duration,
  source,
  year_name,
  nation_name,
  nation_slug,
}: SeriesCardProps) {
  return (
    <div className="group relative bg-black/20 rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative aspect-[2/3] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/30 text-sm">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-wrap gap-2 text-xs">
            {duration && (
              <span className="bg-white/10 text-white/90 px-2 py-1 rounded">
                {duration}
              </span>
            )}
            {source && (
              <span className="bg-primary/90 text-white px-2 py-1 rounded">
                {source}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          {year_name && (
            <>
              <span>{year_name}</span>
              <span>•</span>
            </>
          )}
          {nation_name && (
            <Link href={`/nation/${nation_slug}`} className="hover:text-primary">
              {nation_name}
            </Link>
          )}
        </div>
      </div>

      <Link href={`/series/${slug}`} className="absolute inset-0">
        <span className="sr-only">View {title}</span>
      </Link>
    </div>
  );
}
