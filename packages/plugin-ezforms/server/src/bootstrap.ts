import { CoreStrapi } from './types';

const bootstrap = ({ strapi }: { strapi: CoreStrapi }) => {
  // bootstrap phase
  strapi.log.info('BootStrap @repo/ezforms plugin');
};

export default bootstrap;
