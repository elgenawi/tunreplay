import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeriesData, getEpisodeBySlugAndSeriesId, getAllEpisodes } from "../../utils";
import EpisodeView from "@/app/episodes/[slug]/EpisodeView";
import HomeAdBanner from "@/components/HomeAdBanner";

export const dynamic = "force-dynamic";

function decodeSlug(segment: string): string {
  try {
    if (segment.includes("%")) return decodeURIComponent(segment);
    return segment;
  } catch {
    return segment;
  }
}

interface PageProps {
  params: Promise<{ slug: string; episodeSlug: string }> | { slug: string; episodeSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const seriesSlug = decodeSlug(resolved.slug);
  const episodeSlug = decodeSlug(resolved.episodeSlug);

  const series = await getSeriesData(seriesSlug);
  if (!series) return { title: "Not Found" };

  const episode = await getEpisodeBySlugAndSeriesId(series.id, episodeSlug);
  if (!episode) return { title: "Not Found" };

  const title = `${series.title} الحلقة ${episode.episode_number} مترجمة - TUNREPLAY`;
  const description = `مشاهدة وتحميل الحلقة ${episode.episode_number} من ${series.title} مترجم بجودة HD اون لاين`;

  return {
    title,
    description,
    alternates: {
      canonical: `/series/${encodeURIComponent(series.slug)}/episodes/${encodeURIComponent(episode.slug)}`,
    },
  };
}

export default async function SeriesEpisodePage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const rawSeriesSlug = resolved.slug;
  const seriesSlug = decodeSlug(rawSeriesSlug);
  const episodeSlug = decodeSlug(resolved.episodeSlug);

  const series = await getSeriesData(seriesSlug);
  if (!series) notFound();

  const [episode, allEpisodesList] = await Promise.all([
    getEpisodeBySlugAndSeriesId(series.id, episodeSlug),
    getAllEpisodes(series.id),
  ]);

  if (!episode) notFound();

  const sources = episode.embed_url
    ? [
        {
          id: "1",
          type: "embed",
          title: "مشاهدة",
          source: episode.embed_url,
          date_created: "",
          date_updated: "",
          Episode: "",
        },
      ]
    : [];

  const episodeForView = {
    id: String(episode.id),
    title: episode.title,
    slug: episode.slug,
    number: String(episode.episode_number),
    cover: episode.image ?? "",
    date_created: episode.created_at ?? "",
    series: {
      id: String(series.id),
      title: series.title,
      slug: series.slug,
    },
    sources,
    downlaod: [] as { id: number; name: string; link: string; date_created: string; date_updated: string; episode: string }[],
  };

  const sortedEpisodes = [...allEpisodesList].sort((a, b) => {
    const seasonA = Number(a.season) ?? 0;
    const seasonB = Number(b.season) ?? 0;
    if (seasonA !== seasonB) return seasonA - seasonB;
    const numA = Number(a.episode_number) ?? 0;
    const numB = Number(b.episode_number) ?? 0;
    return numA - numB;
  });

  const allEpisodesForView = sortedEpisodes.map((ep) => ({
    title: ep.title,
    slug: ep.slug,
    number: String(ep.episode_number),
    date_created: ep.created_at ?? "",
  }));

  const episodesBasePath = `/series/${rawSeriesSlug}/episodes`;

  return (
    <>
      <HomeAdBanner />
      <EpisodeView
        episode={episodeForView}
        allEpisodes={allEpisodesForView}
        episodesBasePath={episodesBasePath}
      />
    </>
  );
}
