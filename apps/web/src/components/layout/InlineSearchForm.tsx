import { ChevronRightCircleIcon, SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { StrapiLocale } from '@/strapi/strapi';

export function InlineSearchForm({
  className,
  variant = 'header',
  locale,
}: {
  className?: string;
  variant?: 'header' | 'mobile';
  locale: StrapiLocale;
}) {
  const t = useTranslations('layout');
  return (
    <form
      action={`/${locale}/search`}
      method="GET"
      className={cn(
        'inline-flex items-center gap-2 border-b border-b-primary bg-white px-1 py-2 text-primary',
        'dark:border-b-white dark:bg-transparent dark:text-white',
        variant === 'mobile' && 'border-b-white bg-transparent',
        className
      )}
    >
      <label htmlFor="search-query">
        <SearchIcon className="size-4" aria-label="Search" />
      </label>
      <input
        id="search-query"
        name="q"
        autoFocus={false}
        className={cn(
          'w-40 bg-transparent font-light text-black placeholder:text-primary focus-visible:outline-none',
          'dark:text-white dark:placeholder:text-white/80',
          variant === 'mobile' && 'w-full text-primary placeholder:text-primary/80'
        )}
        placeholder={t('quickSearchPlaceholder')}
      />
      <button type="submit">
        <ChevronRightCircleIcon className="size-5" aria-label="Submit" />
      </button>
    </form>
  );
}
