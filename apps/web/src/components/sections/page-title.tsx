import { cn } from '@/lib/utils';
import { ComponentPageTitle } from '@/strapi/components';
import { typographyVariants } from '../ui/typography';

export function PageTitleSection({ as, layout, title }: ComponentPageTitle & { as: 'section' | 'div' }) {
  const Component = as;
  return (
    <Component
      className={cn('py-8', {
        container: layout === 'container',
        'prose prose-neutral dark:prose-invert': layout === 'prose',
      })}
    >
      <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{title}</h1>
    </Component>
  );
}
