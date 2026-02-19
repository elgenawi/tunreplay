'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer, Navigation, List, DownloadLinks } from '@/components/episodes';
import DisqusComments from '@/components/DisqusComments';

interface Source {
  id: string;
  type: string;
  title: string;
  source: string;
  date_created: string;
  date_updated: string;
  Episode: string;
}

interface Download {
  id: number;
  name: string;
  link: string;
  date_created: string;
  date_updated: string;
  episode: string;
}

interface Episode {
  id: string;
  title: string;
  slug: string;
  number: string;
  cover: string;
  date_created: string;
  series: {
    id: string;
    title: string;
    slug: string;
  };
  sources: Source[];
  downlaod: Download[];
}

interface SeriesEpisode {
  title: string;
  slug: string;
  number: string;
  date_created: string;
}

interface EpisodeViewProps {
  episode: Episode;
  allEpisodes: SeriesEpisode[];
}

export default function EpisodeView({ episode, allEpisodes }: EpisodeViewProps) {
  const router = useRouter();
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState('auto');

  // Find megamax source or fallback to first available source
  const defaultSource = episode.sources?.find(source => 
    source.source.includes('megamax.me')
  ) || episode.sources?.[0] || null;
  
  const [currentSource, setCurrentSource] = useState<Source | null>(defaultSource);

  // Sort sources to put megamax.me first
  const sortedSources = useMemo(() => {
    if (!episode.sources?.length) return [];
    return [...episode.sources].sort((a, b) => {
      const aIsMegamax = a.source.includes('megamax.me');
      const bIsMegamax = b.source.includes('megamax.me');
      if (aIsMegamax && !bIsMegamax) return -1;
      if (!aIsMegamax && bIsMegamax) return 1;
      return 0;
    });
  }, [episode.sources]);

  const currentEpisodeIndex = allEpisodes.findIndex(ep => ep.slug === episode.slug);
  const previousEpisode = currentEpisodeIndex > 0 ? allEpisodes[currentEpisodeIndex - 1] : null;
  const nextEpisode = currentEpisodeIndex < allEpisodes.length - 1 ? allEpisodes[currentEpisodeIndex + 1] : null;

  // Update episodes list height based on video player height
  useEffect(() => {
    const updateHeight = () => {
      if (videoPlayerRef.current) {
        const videoHeight = videoPlayerRef.current.offsetHeight;
        const headerHeight = 40;
        const searchHeight = 48;
        const newHeight = videoHeight - headerHeight - searchHeight;
        setListHeight(`${newHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleEpisodeSelect = (slug: string) => {
    router.push(`/episodes/${slug}`);
  };

  const handleSourceChange = (source: Source) => {
    setCurrentSource(source);
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {episode.series.title} - {episode.title} - {episode.number}  
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 order-1" ref={videoPlayerRef}>
            <VideoPlayer
              currentSource={currentSource}
              sources={sortedSources}
              onSourceChange={handleSourceChange}
            />

            <Navigation
              previousEpisode={previousEpisode}
              nextEpisode={nextEpisode}
              seriesSlug={episode.series.slug}
              onNavigate={handleEpisodeSelect}
            />
          </div>

          {/* Episodes List */}
          <div className="lg:col-span-1 order-2">
            <List
              episodes={allEpisodes}
              currentEpisodeSlug={episode.slug}
              listHeight={listHeight}
              onEpisodeSelect={handleEpisodeSelect}
            />
          </div>

          {/* Download Links */}
          <div className="lg:col-span-4 order-3">
            <DownloadLinks downloads={episode.downlaod} />
          </div>

          {/* Comments Section */}
          <div className="lg:col-span-4 order-4">
            <div className="mt-8">
              <h2 className="text-lg font-bold text-white mb-4">التعليقات</h2>
              <DisqusComments
                identifier={episode.id}
                title={`${episode.series.title} - ${episode.title}`}
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/episodes/${episode.slug}`}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}