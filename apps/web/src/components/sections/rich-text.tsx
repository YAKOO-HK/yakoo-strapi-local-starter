import { StrapiRichtext } from '@/components/ui/strapi-richtext';
import { cn } from '@/lib/utils';
import { ComponentRichText } from '@/strapi/components';

export function RichTextSection({ layout, content }: ComponentRichText) {
  return (
    <section
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
    </section>
  );
}
