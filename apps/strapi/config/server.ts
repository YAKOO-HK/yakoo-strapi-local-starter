export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', undefined),
  proxy: env.bool('PROXY', false)
    ? {
        koa: true,
        ipHeader: env('PROXY_IP_HEADER', 'X-Forwarded-For'),
        maxIpsCount: env.int('PROXY_MAX_IPS_COUNT', 1),
      }
    : false,
  app: {
    keys: env.array('APP_KEYS'),
  },
  logger: {
    update: { enabled: false },
    startup: { enabled: true },
  },
  transfer: {
    remote: { enabled: false }, // disable remote transfer by default
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
