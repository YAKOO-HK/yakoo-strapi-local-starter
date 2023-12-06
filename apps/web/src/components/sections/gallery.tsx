'use client';

import { useState } from 'react';
import Image from 'next/image';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { ComponentGallery } from '@/strapi/components';
import { StrapiImageLoader, StrapiRawImageLoader } from '@/strapi/image-loader';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { cn } from '@/lib/utils';

export default function GallerySection({ layout, slides }: ComponentGallery) {
  const [index, setIndex] = useState(-1);
  return (
    <section
      className={cn({
        container: layout === 'container',
        'prose prose-neutral dark:prose-invert mx-auto': layout === 'prose',
      })}
    >
      <PhotoAlbum
        layout="rows"
        targetRowHeight={150}
        photos={slides.data.map(({ attributes }, index) => {
          return {
            src: attributes.url,
            width: (150 * attributes.width) / attributes.height,
            height: 150,
            alt: attributes.alternativeText || `Photo ${index + 1}`,
            placeholder: (attributes.placeholder as `data:image/${string}`) || 'empty',
          };
        })}
        renderPhoto={({ photo, imageProps }) => (
          <Image
            {...imageProps}
            loader={StrapiRawImageLoader}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            placeholder={photo.placeholder}
          />
        )}
        onClick={({ index: current }) => {
          // console.log('onClick');
          setIndex(current);
        }}
      />
      <Lightbox
        index={index}
        plugins={[Thumbnails]}
        slides={slides.data.map(({ attributes }, index) => {
          return {
            type: 'image',
            src: attributes.url,
            width: attributes.width,
            height: attributes.height,
            alt: attributes.alternativeText || `Photo ${index + 1}`,
            placeholder: (attributes.placeholder as `data:image/${string}`) || 'empty',
          };
        })}
        render={{
          slide: ({ slide }) => (
            <Image
              loader={StrapiImageLoader}
              src={slide.src}
              alt={slide.alt || ''}
              width={slide.width}
              height={slide.height}
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
    </section>
  );
}
