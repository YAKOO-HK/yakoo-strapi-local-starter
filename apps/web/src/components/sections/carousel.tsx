'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { ComponentCarousel, ComponentSlide, DynamicZoneSectionProps } from '@/strapi/components';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { typographyVariants } from '../ui/typography';

function Slide({ image, title, caption }: Omit<ComponentSlide, 'link' | 'id' | '__component'>) {
  return (
    <AspectRatio ratio={16 / 9}>
      <Image
        loader={StrapiImageLoader}
        src={image.url}
        alt={image.alternativeText || ''}
        width={1920}
        height={(1920 * image.height) / image.width}
        placeholder={image.placeholder || 'empty'}
        className="size-full object-cover object-center"
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

const useEmblaDotButton = (emblaApi?: EmblaCarouselType) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export function CarouselSection({ as, slides, layout }: ComponentCarousel & DynamicZoneSectionProps) {
  const Component = as;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnMouseEnter: true })]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useEmblaDotButton(emblaApi);
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
        'mx-auto max-w-prose': layout === 'prose',
      })}
    >
      <span className="sr-only" aria-live="polite">
        {label}
      </span>
      <button
        role="button"
        className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring absolute inset-y-2 left-2 z-10 w-8 rounded-md hover:bg-neutral-100/75 focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={scrollPrev}
      >
        <ArrowLeftIcon className="size-8" />
        <span className="sr-only">Previous Slide</span>
      </button>
      <button
        role="button"
        className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring absolute inset-y-2 right-2 z-10 w-8 rounded-md hover:bg-neutral-100/75 focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={scrollNext}
      >
        <ArrowRightIcon className="size-8" />
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
                  className="embla__slide h-auto w-full min-w-0 shrink-0 grow-0 basis-full"
                  target={link.includes('://') ? '_blank' : undefined}
                  rel={link.includes('://') ? 'noopener noreferrer' : undefined}
                >
                  <Slide image={image} title={title} caption={caption} />
                </Link>
              );
            }
            return (
              <div key={id} className="embla__slide h-auto w-full min-w-0 shrink-0 grow-0 basis-full">
                <Slide image={image} title={title} caption={caption} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-4 grid w-full place-items-center lg:bottom-12">
        <div className="flex flex-wrap justify-center gap-5">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onDotButtonClick(index)}
              aria-current={index === selectedIndex ? 'true' : undefined}
              className={cn(
                'm-0 size-3 cursor-pointer touch-manipulation appearance-none rounded-full border-0 bg-white p-0',
                'aria-current:bg-primary'
              )}
            >
              <span className="sr-only">{`Go to Slide ${index + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </Component>
  );
}
