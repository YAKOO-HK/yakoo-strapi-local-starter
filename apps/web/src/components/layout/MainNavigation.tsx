'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationItem } from '@/strapi/navigation';

const isExternalLink = (path: string) => path.includes('://');

export function MainNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav className="container flex max-w-5xl items-center justify-between pt-4">
      <ul className="flex flex-wrap items-center gap-4">
        {items.map((parentItem) => {
          const isExternal = isExternalLink(parentItem.path);
          if (!parentItem.items?.length) {
            return (
              <Button asChild key={parentItem.id} variant="ghost">
                <Link
                  href={isExternal ? parentItem.path : `${parentItem.path}`}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {parentItem.title}
                </Link>
              </Button>
            );
          }
          // console.log(parentItem.items);
          return (
            <li key={parentItem.id}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{parentItem.title}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {parentItem.items.map(({ id, path, title, external }) => {
                    // console.log({ id, path, title, external, parent: parentItem.path });
                    const isExternal = isExternalLink(path);
                    return (
                      <DropdownMenuItem asChild className="cursor-pointer text-lg" key={id}>
                        <Link
                          href={external ? path : `${parentItem.path === '/' ? '' : parentItem}${path}`}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          prefetch={false}
                        >
                          {title}
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
