/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },

  // Add build error ignoring
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  },

  // Add sitemap configuration
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
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