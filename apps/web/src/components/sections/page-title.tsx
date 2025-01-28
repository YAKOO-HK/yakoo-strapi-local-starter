import { cn } from '@/lib/utils';
import { ComponentPageTitle, DynamicZoneSectionProps } from '@/strapi/components';
import { typographyVariants } from '../ui/typography';

export function PageTitleSection({
  as = 'div',
  layout,
  title,
  className,
}: Omit<ComponentPageTitle, 'id' | '__component'> & DynamicZoneSectionProps & { className?: string }) {
  const Component = as;
  return (
    <Component
      className={cn(
        'py-8',
        {
          container: layout === 'container',
          'mx-auto max-w-prose': layout === 'prose',
        },
        className
      )}
    >
      <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{title}</h1>
    </Component>
  );
}
