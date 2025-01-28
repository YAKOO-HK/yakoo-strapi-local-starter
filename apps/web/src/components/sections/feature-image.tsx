import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ComponentFeatureImage, DynamicZoneSectionProps } from '@/strapi/components';
import { StrapiImageLoader } from '@/strapi/image-loader';

export function FeatureImageSection({ as, layout, image }: ComponentFeatureImage & DynamicZoneSectionProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        {
          container: layout === 'container',
          'mx-auto max-w-prose': layout === 'prose',
        },
        'px-0'
      )}
    >
      <Image
        loader={StrapiImageLoader}
        src={image.url}
        alt={image.alternativeText || ''}
        height={(1920 * image.height) / image.width}
        width={1920}
        sizes="100vw"
        placeholder={image.placeholder || 'empty'}
      />
    </Component>
  );
}
