'use client';

import { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { cn } from '@/lib/utils';
import { StrapiRawImageLoader } from '@/strapi/image-loader';

type ImageFormat = {
  url: string;
  width: number;
  height: number;
};
function getSrcSet(image: ImageFormat) {
  return `${StrapiRawImageLoader({ src: image.url, width: image.width })} ${image.width}w`;
}

type StrapiRichtextProps = ComponentPropsWithoutRef<typeof BlocksRenderer> & {
  className?: string;
  prose?: boolean;
};

export function StrapiRichtext({ className, prose = true, ...props }: StrapiRichtextProps) {
  return (
    <div className={cn(prose ? 'prose prose-neutral dark:prose-invert' : '', className)}>
      <BlocksRenderer
        blocks={{
          image: ({ image, ...props }) => {
            const srcSet: string[] = [];
            if (image.formats?.small) {
              srcSet.push(getSrcSet(image.formats.small as ImageFormat));
            }
            if (image.formats?.medium) {
              srcSet.push(getSrcSet(image.formats.medium as ImageFormat));
            }
            if (image.formats?.large) {
              // console.log(image.formats.large);
              srcSet.push(getSrcSet(image.formats.large as ImageFormat));
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={image.alternativeText || ''}
                height={image.height}
                width={image.width}
                srcSet={srcSet.join(', ')}
                {...props}
              />
            );
          },
          link: ({ children, url, ...props }) => {
            const external = url.includes('://');
            if (external) {
              return (
                <a href={url} {...props} target="_blank" rel="noreferrer noopener">
                  {children}
                </a>
              );
            }
            return (
              <Link href={url} {...props} prefetch={false}>
                {children}
              </Link>
            );
          },
        }}
        {...props}
      />
    </div>
  );
}
