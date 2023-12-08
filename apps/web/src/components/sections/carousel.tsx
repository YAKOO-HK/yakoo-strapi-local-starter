'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { ComponentCarousel, ComponentSlide } from '@/strapi/components';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { typographyVariants } from '../ui/typography';

function Slide({ image, title, caption }: Omit<ComponentSlide, 'link' | 'id' | '__component'>) {
  return (
    <AspectRatio ratio={16 / 9}>
      <Image
        loader={StrapiImageLoader}
        src={image.data.attributes.url}
        alt={image.data.attributes.alternativeText || ''}
        width={1920}
        height={(1920 * image.data.attributes.height) / image.data.attributes.width}
        placeholder={image.data.attributes.placeholder || 'empty'}
        className="h-full w-full object-cover object-center"
        sizes="100vw"
      />

      {(title || caption) && (
        <div className="absolute inset-x-8 inset-y-0 grid md:inset-12 md:grid-cols-3">
          <div className="flex flex-col justify-end md:col-start-3">
            <div className="bg-black/50 px-4 py-2 text-white">
              {title && <p className={typographyVariants({ variant: 'h3' })}>{title}</p>}
              {caption && <p className="whitespace-pre-wrap">{caption}</p>}
            </div>
          </div>
        </div>
      )}
    </AspectRatio>
  );
}

export function CarouselSection({ as, slides, layout }: ComponentCarousel & { as: 'section' | 'div' }) {
  const Component = as;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnMouseEnter: true })]);
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('settle', () => {
        setLabel(
          `Item ${emblaApi
            .slidesInView()
            .map((i) => i + 1)
            .join(', ')} of ${emblaApi.slideNodes().length}`
        );
      });
    }
  }, [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  return (
    <Component
      className={cn('relative', {
        'container px-0': layout === 'container',
        'mx-auto max-w-[65ch]': layout === 'prose',
      })}
    >
      <span className="sr-only" aria-live="polite">
        {label}
      </span>
      <button
        role="button"
        className="ring-offset-background focus-visible:ring-ring absolute inset-y-2 left-2 z-10 w-8 rounded-md hover:bg-neutral-100/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={scrollPrev}
      >
        <ArrowLeftIcon className="h-8 w-8" />
        <span className="sr-only">Previous Slide</span>
      </button>
      <button
        role="button"
        className="ring-offset-background focus-visible:ring-ring absolute  inset-y-2 right-2 z-10 w-8 rounded-md hover:bg-neutral-100/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={scrollNext}
      >
        <ArrowRightIcon className="h-8 w-8" />
        <span className="sr-only">Next Slide</span>
      </button>
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map(({ id, image, link, title, caption }) => {
            if (link) {
              return (
                <Link
                  href={link}
                  prefetch={false}
                  key={id}
                  className="embla__slide h-auto w-full min-w-0 shrink-0 grow-0 basis-[100%]"
                  target={link.includes('://') ? '_blank' : undefined}
                  rel={link.includes('://') ? 'noopener noreferrer' : undefined}
                >
                  <Slide image={image} title={title} caption={caption} />
                </Link>
              );
            }
            return (
              <div key={id} className="embla__slide h-auto w-full min-w-0 shrink-0 grow-0 basis-[100%]">
                <Slide image={image} title={title} caption={caption} />
              </div>
            );
          })}
        </div>
      </div>
    </Component>
  );
}
