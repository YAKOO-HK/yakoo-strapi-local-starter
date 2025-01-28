/**
 * Application methods
 */
import bootstrap from './bootstrap';
/**
 * Plugin server methods
 */
import config from './config/index';
import contentTypes from './content-types';
import controllers from './controllers';
import destroy from './destroy';
import register from './register';
import routes from './routes';
import services from './services';

export default {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
};
