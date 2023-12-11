/** @type {import('next-sitemap').IConfig} */
module.exports = {
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
    // sitemap
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`],
  },
};
