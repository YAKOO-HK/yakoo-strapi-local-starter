import type { Core } from '@strapi/strapi';

export interface CoreStrapi extends Core.Strapi {}
export interface StrapiContext {
  strapi: CoreStrapi;
}
