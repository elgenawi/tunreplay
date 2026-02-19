'use client';

import EpisodesView from './EpisodesView';
import Banner from '@/components/Banner';
import HomeAdBanner from '@/components/HomeAdBanner';

interface Episode {
  id: string;
  title: string;
  slug: string;
  number: string;
  cover: string;
  series: string;
  date_created: string;
}

interface Props {
  episodes: Episode[];
  bannerCode: string;
}

export default function EpisodesClientPage({ episodes, bannerCode }: Props) {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="w-full mb-8">
          <Banner code={bannerCode} />
        </div>
        <HomeAdBanner />
        <EpisodesView episodes={episodes} />
      </div>
    </main>
  );
} 