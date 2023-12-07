import Image from 'next/image';
import Link from 'next/link';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { type NavigationItem } from '@/strapi/navigation';
import { StrapiMedia } from '@/strapi/strapi';
import { MainNavigation } from './MainNavigation';
import { MobileMenu } from './MobileMenu';

const isExternalLink = (path: string) => path.includes('://');

export async function Header({ logo, navigationItems }: { logo: StrapiMedia; navigationItems: NavigationItem[] }) {
  return (
    <>
      <header className="border-b-border hidden border-b py-2 shadow-md md:block">
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
      <header className="border-b-border flex gap-4 border-b py-2 shadow-md md:hidden">
        <MobileMenu>
          <nav>
            <ul className="space-y-4">
              {navigationItems.map((parentItem) => {
                const isExternal = isExternalLink(parentItem.path);
                if (!parentItem.items?.length) {
                  return (
                    <li key={parentItem.id}>
                      <Link
                        href={isExternal ? parentItem.path : `${parentItem.path}`}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                      >
                        {parentItem.title}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={parentItem.id}>
                    <span className="text-foreground/50">{parentItem.title}</span>
                    <ul className="space-y-4 pl-4 pt-4">
                      {parentItem.items.map(({ id, path, title, external }) => {
                        // console.log({ id, path, title, external, parent: parentItem.path });
                        const isExternal = isExternalLink(path);
                        return (
                          <li key={id}>
                            <Link
                              href={external ? path : `${parentItem.path === '/' ? '' : parentItem}${path}`}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              prefetch={false}
                            >
                              {title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>
        </MobileMenu>
        <Link href="/">
          <Image
            loader={StrapiImageLoader}
            src={logo.attributes.url}
            width={(48 * logo.attributes.width) / logo.attributes.height}
            height={48}
            alt={logo.attributes.alternativeText || ''}
            priority
          />
        </Link>
      </header>
    </>
  );
}
