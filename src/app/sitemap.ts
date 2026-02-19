import { MetadataRoute } from "next";
import { getSitemapSlugs } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSitemapSlugs();

  const routes = [
    {
      url: "https://tunreplay.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://tunreplay.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: "https://tunreplay.com/dmca",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `https://tunreplay.com/${encodeURIComponent("مواعيد-الحلقات")}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap;

  const seriesRoutes = slugs.series.map((slug: string) => ({
    url: `https://tunreplay.com/series/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const genreRoutes = slugs.genres.map((slug: string) => ({
    url: `https://tunreplay.com/genre/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const nationRoutes = slugs.nations.map((slug: string) => ({
    url: `https://tunreplay.com/nation/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const yearRoutes = slugs.years.map((name: string) => ({
    url: `https://tunreplay.com/year/${encodeURIComponent(name)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const typeRoutes = slugs.types.map((slug: string) => ({
    url: `https://tunreplay.com/type/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    ...routes,
    ...seriesRoutes,
    ...genreRoutes,
    ...nationRoutes,
    ...yearRoutes,
    ...typeRoutes,
  ];
}
