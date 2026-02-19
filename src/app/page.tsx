import Slideshow from "@/components/Slideshow";
import PinnedSeriesGrid from '@/components/PinnedSeriesGrid';
import LatestEpisodesGrid from '@/components/LatestEpisodesGrid';
import LatestSeriesGrid from '@/components/LatestSeriesGrid';
import LatestMoviesGrid from '@/components/LatestMoviesGrid';
import LatestAnimeGrid from '@/components/LatestAnimeGrid';
import { Metadata } from 'next';
import { websiteSchema, organizationSchema } from '@/lib/schema';
import Script from 'next/script';
import {
  getPinnedSeries,
  getLatestEpisodes,
  getLatestSeries,
  getLatestMovies,
  getLatestAnime,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'TUNREPLAY - مشاهدة افلام ومسلسلات اون لاين',
  description: 'موقع TUNREPLAY لمشاهدة الافلام والمسلسلات الاجنبي والاسيوي والانمي , مشاهدة احدث الافلام الاجنبي , افلام اون لاين , مسلسلات اونلاين , تحميل مسلسلات وافلام',
  keywords: [
    'افلام', 'مسلسلات', 'اجنبي', 'اسيوي', 'انمي',
    'مشاهدة', 'تحميل', 'اون لاين', 'مترجم',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'TUNREPLAY - مشاهدة افلام ومسلسلات اون لاين',
    description: 'موقع TUNREPLAY لمشاهدة الافلام والمسلسلات الاجنبي والاسيوي والانمي , مشاهدة احدث الافلام الاجنبي , افلام اون لاين , مسلسلات اونلاين , تحميل مسلسلات وافلام',
    siteName: 'TUNREPLAY',
    locale: 'ar_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TUNREPLAY - مشاهدة افلام ومسلسلات اون لاين',
    description: 'موقع TUNREPLAY لمشاهدة الافلام والمسلسلات الاجنبي والاسيوي والانمي , مشاهدة احدث الافلام الاجنبي , افلام اون لاين , مسلسلات اونلاين , تحميل مسلسلات وافلام',
  },
  alternates: { canonical: '/' },
  other: {
    'revisit-after': '1 hour',
    distribution: 'Global',
    rating: 'General',
    'content-language': 'ar-eg',
    'resource-type': 'document',
    'Cache-Control': 'no-cache',
    'apple-mobile-web-app-capable': 'yes',
    'theme-color': '#ed3c3c',
    'msapplication-navbutton-color': '#ed3c3c',
    'apple-mobile-web-app-status-bar-style': '#ed3c3c',
  },
};

export default async function Home() {
  const [pinnedSeries, latestEpisodes, latestSeries, latestMovies, latestAnime] =
    await Promise.all([
      getPinnedSeries(),
      getLatestEpisodes(),
      getLatestSeries(),
      getLatestMovies(),
      getLatestAnime(),
    ]);

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, organizationSchema]),
        }}
      />
      <div className="min-h-screen">
        <div className="relative">
          <Slideshow series={pinnedSeries} />

          <PinnedSeriesGrid series={pinnedSeries} />

          <div className="latest-episodes-section">
            <LatestEpisodesGrid episodes={latestEpisodes} />
          </div>

          <div className="latest-movies-section">
            <LatestMoviesGrid series={latestMovies} />
          </div>

          <div className="latest-series-section">
            <LatestSeriesGrid series={latestSeries} />
          </div>

          <LatestAnimeGrid series={latestAnime} />
        </div>
      </div>
    </>
  );
}
