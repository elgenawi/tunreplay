import { NextResponse } from "next/server";
import { unstable_noStore } from "next/cache";
import { getSitemapSlugs } from "@/lib/queries";

const BASE = "https://tunreplay.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlNode(url: string, lastmod: Date, changefreq: string, priority: number): string {
  return `<url><loc>${escapeXml(url)}</loc><lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export async function GET() {
  unstable_noStore();
  const slugs = await getSitemapSlugs();
  const now = new Date();

  const urls: string[] = [
    urlNode(`${BASE}/`, now, "daily", 1),
    urlNode(`${BASE}/contact`, now, "monthly", 0.3),
    urlNode(`${BASE}/dmca`, now, "monthly", 0.3),
    urlNode(`${BASE}/${encodeURIComponent("مواعيد-الحلقات")}`, now, "daily", 0.8),
  ];

  slugs.series.forEach((slug) => {
    urls.push(urlNode(`${BASE}/series/${encodeURIComponent(slug)}`, now, "weekly", 0.7));
  });
  slugs.genres.forEach((slug) => {
    urls.push(urlNode(`${BASE}/genre/${encodeURIComponent(slug)}`, now, "daily", 0.6));
  });
  slugs.nations.forEach((slug) => {
    urls.push(urlNode(`${BASE}/nation/${encodeURIComponent(slug)}`, now, "daily", 0.6));
  });
  slugs.years.forEach((name) => {
    urls.push(urlNode(`${BASE}/year/${encodeURIComponent(name)}`, now, "daily", 0.6));
  });
  slugs.types.forEach((slug) => {
    urls.push(urlNode(`${BASE}/type/${encodeURIComponent(slug)}`, now, "daily", 0.6));
  });
  slugs.episodes.forEach((e) => {
    urls.push(
      urlNode(
        `${BASE}/series/${encodeURIComponent(e.seriesSlug)}/episodes/${encodeURIComponent(e.episodeSlug)}`,
        now,
        "weekly",
        0.6
      )
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });
}
