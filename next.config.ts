/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  },
  
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    qualities: [50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.tunreplay.com',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.tunreplay.com',
        port: '',
        pathname: '/assets/**',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              "frame-src * data: blob:",
              "script-src * 'unsafe-inline' 'unsafe-eval'",
              "connect-src *",
              "img-src * data: blob:",
              "style-src * 'unsafe-inline'",
              "media-src * blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

// Debug log
console.log('Loading config with:', {
  direct: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  inConfig: nextConfig.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
});

export default nextConfig;