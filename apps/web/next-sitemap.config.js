/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  exclude: [
    // exclude all image routes
    '/*.ico',
    '/*.png',
    '/*.jpg',
    '/*.gif',
    '/icon',
    // exclude all api routes
    '/api/*',
    // gcse search
    '/search',
    // sitemap
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`],
  },
};
