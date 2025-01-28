export default ({ env }) => ({
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
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
  cron: {
    // enabled: true, // enable cron jobs for publisher plugin
  },
  watchIgnoreFiles: ['**/config/sync/**'],
});
