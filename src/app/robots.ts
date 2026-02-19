import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/series/*',
        '/episodes/*',
        '/genre/*',
        '/nation/*',
        '/year/*',
        '/type/*',
        '/category/*',
        '_next/image?*',
      ],
      disallow: [
        '/api/',         // Protect API routes
        '/_next/',       // Protect Next.js system files
        '/static/',      // Protect static files if any
        '/search',       // Prevent crawling of search results
      ],
    },
    sitemap: 'https://tunreplay.com/sitemap.xml',
    host: 'https://tunreplay.com',
  };
} 