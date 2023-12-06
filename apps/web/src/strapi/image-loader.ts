'use client';

import { env } from '@/env';

export function StrapiImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return `${env.NEXT_PUBLIC_STRAPI_URL}${src}?format=webp&width=${width}&q=${quality || 75}`;
}

export function StrapiRawImageLoader({ src }: { src: string; width?: number }) {
  return `${env.NEXT_PUBLIC_STRAPI_URL}${src}`;
}
