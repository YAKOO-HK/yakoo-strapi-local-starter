'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Command } from 'cmdk';
import { Loader2Icon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useDebounce } from '@/hooks/use-debounce';
import { Link, useRouter } from '@/i18n/routing';
import { StrapiLocale } from '@/strapi/strapi';
import { Button } from './ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

type DocumentMetadata = {
  slug: string;
  title: string;
  type: string;
  locale: StrapiLocale;
  url: string;
};
function ItemLink({ item, onSelect }: { item: DocumentMetadata; onSelect: () => void }) {
  const router = useRouter();
  return (
    <CommandItem
      value={item.url}
      onSelect={() => {
        if (item.url) {
          router.push(item.url, { locale: item.locale });
          onSelect();
        }
      }}
      className="w-full cursor-pointer"
      asChild
    >
      <Link
        href={item.url || '#'}
        locale={item.locale}
        prefetch={false}
        onClick={() => {
          onSelect();
        }}
      >
        {item.title}
      </Link>
    </CommandItem>
  );
}

export function TypesenseSearch() {
  const t = useTranslations('layout');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedValue = useDebounce(searchInput, 500);
  const { data, isFetching } = useQuery({
    queryKey: ['/api/search', locale, debouncedValue.trim()],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${debouncedValue.trim()}&locale=${locale}`);
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
        {t.rich('quickSearch', {
          kbd: (chunks) => (
            <kbd className="pointer-events-none mx-1 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium text-muted-foreground opacity-100">
              {chunks}
            </kbd>
          ),
        })}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false, onValueChange: console.log }}
      >
        <CommandInput placeholder={t('quickSearchPlaceholder')} value={searchInput} onValueChange={setSearchInput} />
        <CommandList>
          {isFetching && (
            <Command.Loading>
              <div className="inline-flex px-4 py-6 text-center text-sm text-muted-foreground">
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                <span>{t('loading')}</span>
              </div>
            </Command.Loading>
          )}
          <CommandGroup heading={t('quickSearchHeading')}>
            {data?.documents.map((item) => (
              <ItemLink
                key={item.slug}
                item={item}
                onSelect={() => {
                  setOpen(false);
                }}
              />
            ))}
          </CommandGroup>
          <CommandEmpty>{t('emptyResults')}</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
}
