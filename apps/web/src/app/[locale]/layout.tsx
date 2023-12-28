import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { unstable_setRequestLocale } from 'next-intl/server';
import { BackToTopButton } from '@/components/layout/BackToTopButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipToMain } from '@/components/layout/SkipToMain';
import { Toaster } from '@/components/ui/toaster';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { locales } from '@/navigation';
import { getMainNavigation } from '@/strapi/navigation';
import { getSiteMetadata } from '@/strapi/site-metadata';
import { getOpenGraphImage, StrapiLocale } from '@/strapi/strapi';
import '../global.css';
import { AskAi } from '@/components/AskAi';
import { LdJson } from '@/components/ldjson/ldjson';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata({ params }: { params: { locale: StrapiLocale } }) {
  const { seo } = await getSiteMetadata(params.locale);
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: seo.metaTitle,
      template: '%s | ' + seo.metaTitle,
    },
    description: seo.metaDescription,
    robots: seo.metaRobots,
    keywords: seo.keywords,
    openGraph: {
      title: {
        default: seo.metaTitle,
        template: '%s | ' + seo.metaTitle,
      },
      description: seo.metaDescription || undefined,
      images: getOpenGraphImage(seo),
    },
  } satisfies Metadata;
}

function GoogleAnalytics() {
  if (!env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}');
`}
      </Script>
    </>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: StrapiLocale }; // TODO: use zod to check?
}) {
  if (!locales.includes(params.locale)) {
    notFound();
  }
  unstable_setRequestLocale(params.locale);
  const { logo, locale, seo } = await getSiteMetadata(params.locale);
  const navigationItems = await getMainNavigation(params.locale);

  // console.log(data);
  return (
    <html lang={locale} dir="ltr">
      <body className={cn(inter.variable)}>
        <LdJson structuredData={seo.structuredData} />
        <GoogleAnalytics />
        <SkipToMain />
        <Header logo={logo.data} navigationItems={navigationItems} locale={locale} />
        {children}
        <Footer />
        {env.TYPESENSE_ENABLED ? (
          <div className="fixed bottom-2 left-2 z-10">
            <AskAi />
          </div>
        ) : null}
        <BackToTopButton />
        <Toaster />
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-0 right-0 z-[99999] bg-teal-200 px-2 py-1 text-sm text-teal-900">
            Breakpoint:
            <span className="ml-1 font-bold sm:hidden">xs</span>
            <span className="ml-1 hidden font-bold sm:inline-block md:hidden">sm</span>
            <span className="ml-1 hidden font-bold md:inline-block lg:hidden">md</span>
            <span className="ml-1 hidden font-bold lg:inline-block xl:hidden">lg</span>
            <span className="ml-1 hidden font-bold xl:inline-block 2xl:hidden">xl</span>
            <span className="ml-1 hidden font-bold 2xl:inline-block">2xl</span>
          </div>
        )}
      </body>
    </html>
  );
}
