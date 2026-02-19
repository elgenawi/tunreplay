import { Metadata } from 'next';
import { Suspense } from 'react';
import EpisodesClientPage from './EpisodesClientPage';
import { getBannerCode } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Episode {
  id: string;
  title: string;
  slug: string;
  number: string;
  cover: string;
  series: string;
  date_created: string;
}

async function getEpisodes(): Promise<Episode[]> {
  try {
    const response = await fetch(
      `${API_URL}/items/episodes?fields=id,title,slug,number,cover,series,date_created&sort=-date_created&limit=-1`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch episodes');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'أحدث الحلقات - TUNREPLAY',
  description: 'شاهد أحدث الحلقات المضافة على موقع TUNREPLAY',
  keywords: ['حلقات', 'أنمي', 'مسلسلات', 'مشاهدة', 'اون لاين', 'مترجم'],
};

export default async function Page() {
  const [episodes, bannerCode] = await Promise.all([
    getEpisodes(),
    getBannerCode()
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EpisodesClientPage episodes={episodes} bannerCode={bannerCode} />
    </Suspense>
  );
} 