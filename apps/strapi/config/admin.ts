export default ({ env }) => {
  const PREVIEW_HOST = new URL(env('PREVIEW_URL', 'http://localhost:3000'));
  return {
    url: '/dashboard',
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: [PREVIEW_HOST.origin],
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi.documents(uid).findOne({ documentId });
          let prefix = '';
          switch (uid) {
            case 'api::post.post':
              prefix = '/posts' + '/-'; // TODO: find categorySlug
              break;
            case 'api::page.page':
              break;
            default:
              return '';
          }

          const pathname = `/${locale}${prefix}/${document.slug}`;
          const previewUrl = new URL(`${env('PREVIEW_URL')}/api/preview`);
          previewUrl.searchParams.set('url', `${env('PREVIEW_URL')}${pathname}`);
          previewUrl.searchParams.set('status', status);
          previewUrl.searchParams.set('secret', env('PREVIEW_SECRET'));
          return previewUrl.toString();
        },
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', false),
      promoteEE: env.bool('FLAG_PROMOTE_EE', false),
    },
    cron: {
      enabled: true, // enable cron jobs for publisher plugin
    },
    watchIgnoreFiles: ['**/config/sync/**'],
  };
};
