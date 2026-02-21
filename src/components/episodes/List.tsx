import { useRef, useState, useEffect } from 'react';

interface Episode {
  slug: string;
  number: string;
}

interface ListProps {
  episodes: Episode[];
  currentEpisodeSlug: string;
  listHeight: string;
  onEpisodeSelect: (slug: string) => void;
}

export default function List({ 
  episodes, 
  currentEpisodeSlug,
  listHeight,
  onEpisodeSelect 
}: ListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const currentEpisodeRef = useRef<HTMLButtonElement>(null);
  const episodesListRef = useRef<HTMLDivElement>(null);

  const filteredEpisodes = episodes
    .filter(ep => 
      ep.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const numA = Number(a.number) || 0;
      const numB = Number(b.number) || 0;
      return numA - numB;
    });

  // Scroll to current episode when component mounts or episode changes
  useEffect(() => {
    if (currentEpisodeRef.current && episodesListRef.current) {
      const list = episodesListRef.current;
      const episode = currentEpisodeRef.current;
      const episodeTop = episode.offsetTop;
      const episodeHeight = episode.offsetHeight;
      const listHeight = list.clientHeight;
      const scrollTop = episodeTop - (listHeight / 2) + (episodeHeight / 2);
      
      list.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [currentEpisodeSlug]);

  return (
    <div className="bg-white/5 rounded-lg p-4 sticky top-24">
      <h2 className="text-lg font-bold text-white mb-4 text-right">
        جميع حلقات الأنمي
      </h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث عن حلقة..."
          className="w-full px-4 py-2 bg-white/5 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-right text-sm sm:text-base"
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

      <div 
        ref={episodesListRef}
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"
        style={{ 
          height: listHeight || 'calc(100vh - 300px)',
          maxHeight: 'calc(100vh - 300px)'
        }}
      >
        <div className="space-y-2">
          {filteredEpisodes.map((ep) => (
            <button
              key={ep.slug}
              ref={ep.slug === currentEpisodeSlug ? currentEpisodeRef : null}
              onClick={() => onEpisodeSelect(ep.slug)}
              className={`w-full block px-4 py-2 rounded-lg text-right transition text-sm sm:text-base ${
                ep.slug === currentEpisodeSlug
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
              }`}
            >
              الحلقة {ep.number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 