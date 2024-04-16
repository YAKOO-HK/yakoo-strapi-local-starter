import { PageComponent } from '@/strapi/components';
import { StrapiLocale } from '@/strapi/strapi';
import { CarouselSection } from './sections/carousel';
import { ContactFormSection } from './sections/contact-form';
import { EmbedYoutubeSection } from './sections/embed-youtube';
import { FeatureImageSection } from './sections/feature-image';
import { GallerySection } from './sections/gallery';
import { HeroSection } from './sections/hero-section';
import { PageTitleSection } from './sections/page-title';
import { RichTextSection } from './sections/rich-text';

export async function DynamicZone({
  as = 'div',
  sections,
  locale,
}: {
  as?: 'div' | 'section';
  sections: PageComponent[];
  locale: StrapiLocale;
}) {
  return sections.map((section) => {
    switch (section.__component) {
      case 'page-components.rich-text':
        return <RichTextSection key={`rich-text-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.hero-section':
        return <HeroSection key={`hero-section-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.feature-image':
        return <FeatureImageSection key={`feature-image-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.carousel':
        return <CarouselSection key={`carousel-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.gallery':
        return <GallerySection key={`gallery-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.page-title':
        return <PageTitleSection key={`page-title-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.embed-youtube':
        return <EmbedYoutubeSection key={`embed-youtube-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.contact-form':
        return <ContactFormSection key={`contact-form-${section.id}`} {...section} as={as} locale={locale} />;
      case 'page-components.html':
        return <div key={`html-${section.id}`} dangerouslySetInnerHTML={{ __html: section.content }} />;
      default:
        console.warn('Unknown component:', section);
        return null;
    }
  });
}
