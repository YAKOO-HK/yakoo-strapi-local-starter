import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 100],
    minimumCacheTTL: 86400,
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
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
