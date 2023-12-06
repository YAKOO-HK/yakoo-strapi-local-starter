import { type Metadata } from 'next';
import { Noto_Sans_HK } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from '@/components/ui/toaster';
import { env } from '@/env';
import { getSiteMetadata } from '@/strapi/site-metadata';
import { getOpenGraphImage } from '@/strapi/strapi';
import './global.css';
import { cn } from '@/lib/utils';

// const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansHk = Noto_Sans_HK({
  variable: '--font-noto-sans-hk',
  // preload: false,
  subsets: ['latin'],
});

export async function generateMetadata() {
  const seo = await getSiteMetadata();
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={cn(notoSansHk.variable, 'bg-background text-foreground')}>
        <GoogleAnalytics />
        {children}
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
