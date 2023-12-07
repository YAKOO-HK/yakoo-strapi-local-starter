import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { StrapiLocale } from './strapi';

export type NavigationItem = WrapperNavigationItem | InternalNavigationItem | ExternalNavigationItem;
export interface BaseNavigationItem {
  order: number;
  id: number;
  title: string;
  path: string;
  external: boolean;
  items: Array<NavigationItem>;
}
export interface WrapperNavigationItem extends BaseNavigationItem {
  type: 'WRAPPER';
}
export interface InternalNavigationItem extends BaseNavigationItem {
  type: 'INTERNAL';
  related: {
    id: number;
    title: string;
    slug: string;
  };
}
export interface ExternalNavigationItem extends BaseNavigationItem {
  type: 'EXTERNAL';
}

export async function getMainNavigation(locale: StrapiLocale = 'en') {
  const querystring = qs.stringify(
    {
      type: 'TREE',
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/navigation/render/main-navigation?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['navigation'] },
  }).then(fetchResponseHandler<NavigationItem[]>());
  // console.log(response);
  return response;
}
