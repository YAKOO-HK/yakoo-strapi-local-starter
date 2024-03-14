export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation?tab=readme-ov-file#slug-generation
    const navigationCommonService = strapi.plugin('navigation').service('common');
    const originalGetSlug = navigationCommonService.getSlug;
    const preprocess = (q) => {
      return 'nav ' + q;
    };

    navigationCommonService.getSlug = (query) => {
      return originalGetSlug(preprocess(query));
    };
  },
};
