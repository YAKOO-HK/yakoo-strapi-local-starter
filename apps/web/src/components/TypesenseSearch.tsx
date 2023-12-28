'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Command } from 'cmdk';
import { Loader2Icon } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Link } from '@/navigation';
import { StrapiLocale } from '@/strapi/strapi';
import { Button } from './ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

type DocumentMetadata = {
  slug: string;
  title: string;
  type: string;
  locale: StrapiLocale;
};
function ItemLink({ item }: { item: DocumentMetadata }) {
  const { data } = useQuery({
    queryKey: ['/api/search/get-url', item.slug, item.type],
    queryFn: async () => {
      if (item.type === 'page') {
        return `/${item.slug}`;
      }
      const response = await fetch(`/api/search/get-url?slug=${item.slug}&type=${item.type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch url');
      }
      return response.json() as Promise<string>;
    },
  });
  return (
    <Link href={data || '#'} locale={item.locale} className="block w-full" prefetch={false}>
      {item.title}
    </Link>
  );
}

export function TypesenseSearch() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedValue = useDebounce(searchInput, 500);
  const { data, isFetching } = useQuery({
    queryKey: ['/api/search', debouncedValue.trim()],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${debouncedValue.trim()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      return response.json() as Promise<{ documents: DocumentMetadata[] }>;
    },
    enabled: debouncedValue.trim().length > 0,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Press{' '}
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
        to search
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} commandProps={{ shouldFilter: false }}>
        <CommandInput placeholder="Search..." value={searchInput} onValueChange={setSearchInput} />
        <CommandList>
          {isFetching && (
            <Command.Loading>
              <div className="text-muted-foreground inline-flex px-4 py-6 text-center text-sm">
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading …</span>
              </div>
            </Command.Loading>
          )}
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Results">
            {data?.documents.map((item) => (
              <CommandItem key={item.slug} value={item.slug} onSelect={() => setOpen(false)}>
                <ItemLink item={item} />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
