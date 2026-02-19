import Link from 'next/link';

interface Episode {
  slug: string;
  number: string;
}

interface NavigationProps {
  previousEpisode: Episode | null;
  nextEpisode: Episode | null;
  seriesSlug: string;
  onNavigate: (slug: string) => void;
}

export default function Navigation({ 
  previousEpisode, 
  nextEpisode, 
  seriesSlug,
  onNavigate 
}: NavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {previousEpisode ? (
        <button
          onClick={() => onNavigate(previousEpisode.slug)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition text-sm sm:text-base"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="hidden sm:inline">الحلقة السابقة</span>
          <span className="sm:hidden">السابقة</span>
        </button>
      ) : (
        <div className="hidden sm:block w-[140px]" />
      )}

      <Link
        href={`/series/${seriesSlug}`}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white transition text-sm sm:text-base"
      >
        <span className="hidden sm:inline">صفحة الرئيسية</span>
        <span className="sm:hidden">الرئيسية</span>
      </Link>

      {nextEpisode ? (
        <button
          onClick={() => onNavigate(nextEpisode.slug)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition text-sm sm:text-base"
        >
          <span className="hidden sm:inline">الحلقة التالية</span>
          <span className="sm:hidden">التالية</span>
          <svg
            className="w-5 h-5 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      ) : (
        <div className="hidden sm:block w-[140px]" />
      )}
    </div>
  );
} 