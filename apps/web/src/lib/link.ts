import { env } from '@/env';

export const isExternalLink = (path: string) => {
  if (path.startsWith(env.NEXT_PUBLIC_SITE_URL)) return false;
  if (path.startsWith('http://')) return true;
  if (path.startsWith('https://')) return true;
  return false;
};
