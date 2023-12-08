export default ({ env }) => ({
  'local-image-sharp': {
    config: {
      paths: ['/uploads'],
      cacheDir: env('STRAPI_PLUGIN_LOCAL_IMAGE_SHARP_CACHE_DIR', '.image-cache'),
      maxAge: 31536000, // which corresponds to 1 year: 60 seconds × 60 minutes × 24 hours × 365 days = 31536000 seconds.
    },
  },
  upload: {
    config: {
      provider: 'local',
      sizeLimit: 10 * 1024 * 1024, // 10mb
      providerOptions: {},
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 465),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        secure: env('SMTP_AUTH_SECURE', 'true') === 'true',
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO'),
      },
    },
  },
  'rest-cache': {
    config: {
      provider: {
        name: 'memory',
        getTimeout: 500,
        options: {
          // The maximum size of the cache
          max: 32767,
          // Update to the current time whenever it is retrieved from cache, causing it to not expire
          updateAgeOnGet: false,
          // ...
        },
      },
      strategy: {
        // resetOnStartup: true,
        contentTypes: [
          // List of content types to cache
          'api::post.post',
          'api::post-category.post-category',
          'api::page.page',
          // 'api::navigations.navigation',
          'api::site-metadata.site-metadata',
          'api::homepage.homepage',
        ],
      },
    },
  },
  navigation: {
    enabled: true,
    config: {
      allowedLevels: 2,
    },
  },
  ckeditor: {
    enabled: true,
  },
  publisher: {
    enabled: true,
    config: {
      components: {
        dateTimePicker: {
          step: 15,
        },
      },
      contentTypes: ['api::post.post'],
    },
  },
});
