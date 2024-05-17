'use client';

import { useMemo } from 'react';
import dynamic, { DynamicOptionsLoadingProps } from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';
import type { LeafletMapProps } from './_inner';

function Loading(_props: DynamicOptionsLoadingProps) {
  // console.log(_props);
  return <Skeleton className="h-96 w-full" />;
}

function LeafletMap(props: LeafletMapProps) {
  const LeafletMapWithNoSSR = useMemo(
    () =>
      dynamic(() => import('./_inner'), {
        loading: Loading,
        ssr: false,
      }),
    []
  );
  return <LeafletMapWithNoSSR {...props} />;
}

export { LeafletMap };
