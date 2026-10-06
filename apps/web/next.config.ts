import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 100],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    maximumDiskCacheSize: 1024 * 1024 * 1024, // 1gb
    remotePatterns: [process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'].map((url) => {
      const { hostname, protocol } = new URL(url);
      return {
        protocol: protocol.replace(':', '') as 'http' | 'https',
        hostname,
      };
    }),
  },
  logging: {
    fetches: {
      //   fullUrl: true,
    },
  },
  reactStrictMode: true,
  cacheMaxMemorySize: 20 * 1024 * 1024, // 20mb
};

export default withNextIntl(nextConfig);
