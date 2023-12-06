import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ComponentFeatureImage } from '@/strapi/components';
import { StrapiImageLoader } from '@/strapi/image-loader';

export function FeatureImageSection({ as, layout, image }: ComponentFeatureImage & { as: 'section' | 'div' }) {
  const Component = as;
  return (
    <Component
      className={cn({
        container: layout === 'container',
        'prose mx-auto': layout === 'prose',
      })}
    >
      <Image
        loader={StrapiImageLoader}
        src={image.data.attributes.url}
        alt={image.data.attributes.alternativeText || ''}
        height={(1920 * image.data.attributes.height) / image.data.attributes.width}
        width={1920}
        sizes="100vw"
        placeholder={image.data.attributes.placeholder || 'empty'}
      />
    </Component>
  );
}
