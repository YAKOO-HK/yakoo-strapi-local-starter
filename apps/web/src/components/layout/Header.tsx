import Image from 'next/image';
import Link from 'next/link';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { type NavigationItem } from '@/strapi/navigation';
import { StrapiMedia } from '@/strapi/strapi';
import { MainNavigation } from './MainNavigation';

export async function Header({ logo, navigationItems }: { logo: StrapiMedia; navigationItems: NavigationItem[] }) {
  return (
    <>
      <header className="border-b-border border-b py-2 shadow-md md:block">
        <div className="container flex items-center gap-4">
          <div>
            <Link href="/">
              <Image
                loader={StrapiImageLoader}
                src={logo.attributes.url}
                width={(64 * logo.attributes.width) / logo.attributes.height}
                height={64}
                alt={logo.attributes.alternativeText || ''}
                priority
              />
              <span className="sr-only">Home</span>
            </Link>
          </div>
          <MainNavigation items={navigationItems} />
        </div>
      </header>
      <header className="block md:hidden">
        <Link href="/">
          <Image
            loader={StrapiImageLoader}
            src={logo.attributes.url}
            width={(64 * logo.attributes.width) / logo.attributes.height}
            height={64}
            alt={logo.attributes.alternativeText || ''}
            priority
          />
        </Link>
      </header>
    </>
  );
}
