'use client';

import { ChevronDownIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from '@/i18n/routing';
import { isExternalLink } from '@/lib/link';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/strapi/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

function getHref(item: NavigationItem, parentItem: NavigationItem) {
  const isExternal = isExternalLink(item.path);
  let href = item.path;
  if (isExternal) {
    // do nothing
  } else if (item.type === 'INTERNAL') {
    // TODO: handle different type in a registry?
    if (item.related?.__type === 'api::post-category.post-category') {
      href = `/posts/${item.related.slug}`;
    } else {
      href = `/${item.related?.slug ?? item.slug}`;
    }
  } else if (item.path.startsWith(parentItem.path)) {
    // do not inherit parent path
    href = item.path.substring(parentItem.path.length);
  }
  return {
    href,
    isExternal,
  };
}

export function MainNavigation({ items, className }: { items: NavigationItem[]; className?: string }) {
  // console.dir(items, { depth: 10 });
  return (
    <nav className={className}>
      <ul className="flex flex-wrap items-center">
        {items
          .filter((item) => item.menuAttached)
          .map((parentItem) => {
            if (!parentItem.items?.length) {
              const isExternal = isExternalLink(parentItem.path);
              return (
                <li key={parentItem.id}>
                  <Link
                    className={cn(
                      buttonVariants({ variant: 'none' }),
                      'text-base text-primary dark:text-white dark:hover:text-neutral-300'
                    )}
                    href={parentItem.path}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    <span className="text-base">{parentItem.title}</span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={parentItem.id}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({ variant: 'none' }),
                      'text-base text-primary hover:bg-transparent dark:text-white dark:hover:text-neutral-300'
                    )}
                  >
                    {parentItem.title}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col items-stretch bg-white">
                    {parentItem.items
                      .filter((item) => item.menuAttached)
                      .map((item) => {
                        const { isExternal, href } = getHref(item, parentItem);
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            asChild
                            className={cn(
                              buttonVariants({ variant: 'none' }),
                              'justify-start text-base text-primary dark:text-white dark:hover:text-neutral-300'
                            )}
                          >
                            <Link
                              href={href}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                            >
                              {item.title}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

export function MobileMainNavigation({ items, className }: { items: NavigationItem[]; className?: string }) {
  return (
    <nav className={className}>
      <ul className="-mx-6 divide-y divide-white">
        {items
          .filter((item) => item.menuAttached)
          .map((parentItem) => {
            if (!parentItem.items?.length) {
              const isExternal = isExternalLink(parentItem.path);
              return (
                <li
                  key={parentItem.id}
                  className="group px-3 py-2 font-light focus-within:bg-primary hover:bg-primary active:bg-primary"
                >
                  <Link
                    href={parentItem.path}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="block text-primary focus-visible:text-white group-hover:text-white"
                  >
                    {parentItem.title}
                  </Link>
                </li>
              );
            }
            return (
              <li key={parentItem.id}>
                <Collapsible>
                  <CollapsibleTrigger className="group flex w-full justify-between px-3 py-2 font-light text-primary hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white aria-expanded:border-b aria-expanded:border-white aria-expanded:bg-primary aria-expanded:text-white">
                    <span>{parentItem.title}</span>
                    <ChevronDownIcon className="size-5 group-aria-expanded:rotate-180" aria-hidden />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="divide-y divide-white">
                      {parentItem.items
                        .filter((item) => item.menuAttached)
                        .map((item) => {
                          const { isExternal, href } = getHref(item, parentItem);
                          return (
                            <li
                              key={item.id}
                              className="group bg-primary/80 px-3 py-2 font-light focus-within:bg-primary hover:bg-primary active:bg-primary"
                            >
                              <Link
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                prefetch={false}
                                className="block text-white"
                              >
                                {item.title}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
