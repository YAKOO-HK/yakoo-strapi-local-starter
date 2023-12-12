'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isExternalLink } from '@/lib/link';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { NavigationItem } from '@/strapi/navigation';

export function MainNavigation({ items, className }: { items: NavigationItem[]; className?: string }) {
  return (
    <nav className={cn('pt-4', className)}>
      <ul className="flex flex-wrap items-center gap-4">
        {items.map((parentItem) => {
          const isExternal = isExternalLink(parentItem.path);
          if (!parentItem.items?.length) {
            return (
              <li key={parentItem.id}>
                <Button asChild variant="ghost">
                  <Link
                    href={isExternal ? parentItem.path : `${parentItem.path}`}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {parentItem.title}
                  </Link>
                </Button>
              </li>
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
