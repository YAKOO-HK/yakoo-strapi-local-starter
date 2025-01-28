import { notFound } from 'next/navigation';
import Script from 'next/script';
import { env } from '@/env';

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
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
