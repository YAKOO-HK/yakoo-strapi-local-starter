import { notFound } from 'next/navigation';
import Script from 'next/script';
import { env } from '@/env';

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  if (!env.NEXT_PUBLIC_GSCE_API) {
    notFound();
  }
  return (
    <>
      <Script async src={env.NEXT_PUBLIC_GSCE_API} strategy="afterInteractive"></Script>
      <div className="container py-8">
        <div className="gcse-search" data-terms={searchParams.q || ''}></div>
      </div>
    </>
  );
}
