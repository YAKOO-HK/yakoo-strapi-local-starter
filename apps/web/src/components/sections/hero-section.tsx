import Image from 'next/image';
import Link from 'next/link';
import tinycolor from 'tinycolor2';
import { buttonVariants } from '@/components/ui/button';
import { StrapiRichtext } from '@/components/ui/strapi-richtext';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ComponentHeroSection } from '@/strapi/components';
import { StrapiImageLoader } from '@/strapi/image-loader';

export function HeroSection({
  as,
  layout,
  bgColor,
  image,
  title,
  tagline,
  buttonLink,
  buttonText,
  content,
  arrangement,
}: ComponentHeroSection & { as: 'section' | 'div' }) {
  const Component = as;
  console.log({ arrangement });
  return (
    <Component
      className={cn('text-foreground flex flex-col items-center md:flex-row', {
        dark: bgColor && tinycolor(bgColor).isDark(),
        'container px-0': layout === 'container',
        'md:flex-row-reverse': arrangement === 'image-last',
      })}
      style={{ backgroundColor: bgColor || 'transparent' }}
    >
      <div className="md:basis-1/2">
        <Image
          loader={StrapiImageLoader}
          src={image.data.attributes.url}
          alt={image.data.attributes.alternativeText || ''}
          height={(960 * image.data.attributes.height) / image.data.attributes.width}
          width={960}
          sizes="50vw"
          placeholder={image.data.attributes.placeholder || 'empty'}
        />
      </div>
      <div
        className={cn('container flex flex-col items-start space-y-4 py-8 md:basis-1/2', {
          'md:items-end': arrangement === 'image-last',
        })}
      >
        <p className={cn(typographyVariants({ variant: 'h1' }))}>{title}</p>
        {tagline && <p className={cn(typographyVariants({ variant: 'h3' }))}>{tagline}</p>}
        {content && <StrapiRichtext content={content} />}
        {buttonLink && (
          <Link
            href={buttonLink}
            className={cn(buttonVariants({ size: 'lg' }))}
            prefetch={false}
            target={buttonLink.includes('://') ? '_blank' : undefined}
            rel={buttonLink.includes('://') ? 'noopener noreferrer' : undefined}
          >
            {buttonText || 'Read More'}
          </Link>
        )}
      </div>
    </Component>
  );
}
