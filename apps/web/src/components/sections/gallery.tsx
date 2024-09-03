'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { RowsPhotoAlbum } from 'react-photo-album';
import Lightbox, { type SlideImage } from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { cn } from '@/lib/utils';
import { ComponentGallery, DynamicZoneSectionProps } from '@/strapi/components';
import { StrapiImageLoader, StrapiRawImageLoader } from '@/strapi/image-loader';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'react-photo-album/rows.css';

export function GallerySection({ as, layout, slides }: ComponentGallery & DynamicZoneSectionProps) {
  const Component = as;
  const [index, setIndex] = useState(-1);
  return (
    <Component
      className={cn({
        container: layout === 'container',
        'mx-auto max-w-prose': layout === 'prose',
      })}
    >
      <RowsPhotoAlbum
        targetRowHeight={150}
        photos={slides.data.map(({ attributes }, i) => {
          return {
            src: attributes.url,
            width: attributes.width,
            height: attributes.height,
            alt: attributes.alternativeText || `Photo ${i + 1}`,
            placeholder: attributes.placeholder || 'empty',
          } satisfies ImageProps;
        })}
        render={{
          image: ({ onClick }, { photo, width, height }) => (
            <Image
              width={width}
              height={height}
              onClick={onClick}
              loader={StrapiImageLoader}
              src={photo.src}
              alt={photo.alt}
              placeholder={photo.placeholder}
            />
          ),
        }}
        onClick={({ index: current }) => {
          setIndex(current);
        }}
      />
      <Lightbox
        index={index}
        plugins={[Thumbnails]}
        slides={slides.data.map(({ attributes }, i) => {
          return {
            type: 'image',
            src: attributes.url,
            width: attributes.width,
            height: attributes.height,
            alt: attributes.alternativeText || `Photo ${i + 1}`,
          } satisfies SlideImage;
        })}
        render={{
          slide: ({ slide, rect }) => (
            <Image
              unoptimized
              src={StrapiRawImageLoader({ src: slide.src })}
              alt={slide.alt || ''}
              width={(rect.height * slide.width!) / slide.height!}
              height={rect.height}
            />
          ),
          thumbnail: ({ slide, rect }) => (
            <Image
              loader={StrapiImageLoader}
              src={slide.src}
              alt={slide.alt || ''}
              width={(rect.height * slide.width!) / slide.height!}
              height={rect.height}
            />
          ),
        }}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </Component>
  );
}
