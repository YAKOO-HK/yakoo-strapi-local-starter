import { cn } from '@/lib/utils';
import { ComponentPageTitle } from '@/strapi/components';
import { typographyVariants } from '../ui/typography';

export function PageTitleSection({
  as = 'div',
  layout,
  title,
  className,
}: Omit<ComponentPageTitle, 'id' | '__component'> & { as?: 'section' | 'div'; className?: string }) {
  const Component = as;
  return (
    <Component
      className={cn(
        'py-8',
        {
          container: layout === 'container',
          'prose prose-neutral dark:prose-invert': layout === 'prose',
        },
        className
      )}
    >
      <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{title}</h1>
    </Component>
  );
}
