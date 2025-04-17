import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { StrapiLocale } from './strapi';

export type NavigationItem = WrapperNavigationItem | InternalNavigationItem | ExternalNavigationItem;
export interface BaseNavigationItem {
  order: number;
  id: number;
  documentId: string;
  title: string;
  path: string;
  external: boolean;
  menuAttached: boolean;
  items: Array<NavigationItem>;
  slug: string;
  uiRouterKey: string;
  additionalFields: Record<string, unknown>;
}
export interface WrapperNavigationItem extends BaseNavigationItem {
  type: 'WRAPPER';
}
export interface InternalNavigationItem extends BaseNavigationItem {
  type: 'INTERNAL';
  related: {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    locale: StrapiLocale;
    __type: string; // content-type-uid
  };
}
export interface ExternalNavigationItem extends BaseNavigationItem {
  type: 'EXTERNAL';
}

export async function getMainNavigation(locale: StrapiLocale = 'en') {
  const querystring = qs.stringify({ type: 'TREE', locale }, { encodeValuesOnly: true });
  const response = await fetch(
    `${env.NEXT_PUBLIC_STRAPI_URL}/api/navigation/render/nav-main-navigation?${querystring}`,
    {
      headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
      next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['navigation', 'navigation-item'] },
    }
  ).then(fetchResponseHandler<NavigationItem[]>());
  // console.log(response);
  return response;
}
