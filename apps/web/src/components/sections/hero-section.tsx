import Image from 'next/image';
import Link from 'next/link';
import tinycolor from 'tinycolor2';
import { buttonVariants } from '@/components/ui/button';
import { StrapiRichtext } from '@/components/ui/strapi-richtext';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ComponentHeroSection } from '@/strapi/components';
import { StrapiImageLoader } from '@/strapi/image-loader';

export function HeroSection({ bgColor, image, title, tagline, buttonLink, buttonText, content }: ComponentHeroSection) {
  return (
    <section
      className={cn('text-foreground grid items-center md:grid-cols-2', {
        dark: bgColor && tinycolor(bgColor).isDark(),
      })}
      style={{ backgroundColor: bgColor || 'transparent' }}
    >
      <div>
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
      <div className="space-y-4 px-4 py-8">
        <p className={cn(typographyVariants({ variant: 'h1' }))}>{title}</p>
        {tagline && <p className={cn(typographyVariants({ variant: 'h3' }))}>{tagline}</p>}
        {content && <StrapiRichtext content={content} />}
        {buttonLink && (
          <Link href={buttonLink} className={cn(buttonVariants({ size: 'lg' }))}>
            {buttonText || 'Read More'}
          </Link>
        )}
      </div>
    </section>
  );
}
