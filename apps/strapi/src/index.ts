import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // https://github.com/strapi/strapi/issues/24535#issuecomment-3381729112
    // Force the socket to be treated as encrypted for proxy setups
    strapi.server.use(async (ctx, next) => {
      if (ctx.req?.socket) {
        (ctx.req.socket as any).encrypted = true;
      }
      await next();
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.log.info('Bootstrap (Custom)');
    // https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation?tab=readme-ov-file#slug-generation
    const navigationCommonService = strapi.plugin('navigation').service('common');
    const originalGetSlug = navigationCommonService.getSlug;
    const preprocess = ({ query }: { query: string }) => {
      return { query: 'nav ' + query };
    };
    navigationCommonService.getSlug = (query) => {
      return originalGetSlug(preprocess(query));
    };
  },
};
