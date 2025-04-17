'use client';

import { useEffect } from 'react';
import { env } from '@/env';
import { useRouter } from '@/i18n/routing';

const strapiUpdateOrigin = new URL(env.NEXT_PUBLIC_STRAPI_URL).origin;

/**
 * @see https://docs.strapi.io/cms/features/preview#6-refresh-frontend
 */
export function PreviewListener() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<{ type: string }>) => {
      if (
        // Filters events emitted through the postMessage() API
        message.origin === strapiUpdateOrigin &&
        message.data.type === 'strapiUpdate'
      ) {
        // Recommended way to refresh with Next.js
        router.refresh();
      }
    };

    // Add the event listener
    window.addEventListener('message', handleMessage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);
  return null;
}
