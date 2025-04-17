import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { AskAi } from '@/components/AskAi';
import { BackToTopButton } from '@/components/layout/BackToTopButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipToMain } from '@/components/layout/SkipToMain';
import { LdJson } from '@/components/ldjson/ldjson';
import { Toaster } from '@/components/ui/toaster';
import { env } from '@/env';
import { locales, routing } from '@/i18n/routing';
import { getMainNavigation } from '@/strapi/navigation';
import { getSiteMetadata } from '@/strapi/site-metadata';
import { getOpenGraphImage, StrapiLocale } from '@/strapi/strapi';
import '../global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata(props: { params: Promise<{ locale: StrapiLocale }> }) {
  const params = await props.params;
  if (!locales.includes(params.locale)) {
    notFound();
  }
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: StrapiLocale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(params.locale);
  const messages = await getMessages();
  const { logo, logo2, logo_link, logo2_link, seo } = await getSiteMetadata(params.locale);
  const navigationItems = await getMainNavigation(params.locale);
  // console.dir(navigationItems, { depth: 10 });
  return (
    <html lang={locale} dir="ltr">
      <body className={inter.variable}>
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          <LdJson structuredData={seo.structuredData} />
          {env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID ? (
            <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID} />
          ) : null}
          <SkipToMain />
          <Header
            logo={logo}
            logo2={logo2}
            logo_link={logo_link}
            logo2_link={logo2_link}
            navigationItems={navigationItems}
            locale={locale}
          />
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
