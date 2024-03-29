import { StrapiRichtext } from '@/components/ui/strapi-richtext';
import { cn } from '@/lib/utils';
import { ComponentRichText, DynamicZoneSectionProps } from '@/strapi/components';

export function RichTextSection({ as, layout, content }: ComponentRichText & DynamicZoneSectionProps) {
  const Component = as;
  return (
    <Component
      className={cn('py-8', {
        container: layout === 'container' || layout === 'prose',
      })}
    >
      <StrapiRichtext
        content={content}
        className={cn('mx-auto', {
          'max-w-full': layout === 'full-width' || layout === 'container',
        })}
      />
    </Component>
  );
}
