import { PageComponent } from '@/strapi/components';
import { CarouselSection } from './sections/carousel';
import { EmbedYoutubeSection } from './sections/embed-youtube';
import { FeatureImageSection } from './sections/feature-image';
import GallerySection from './sections/gallery';
import { HeroSection } from './sections/hero-section';
import { PageTitleSection } from './sections/page-title';
import { RichTextSection } from './sections/rich-text';

export function DynamicZone({ as = 'div', sections }: { as?: 'div' | 'section'; sections: PageComponent[] }) {
  return sections.map((section) => {
    switch (section.__component) {
      case 'page-components.rich-text':
        return <RichTextSection key={`rich-text-${section.id}`} {...section} as={as} />;
      case 'page-components.hero-section':
        return <HeroSection key={`hero-section-${section.id}`} {...section} as={as} />;
      case 'page-components.feature-image':
        return <FeatureImageSection key={`feature-image-${section.id}`} {...section} as={as} />;
      case 'page-components.carousel':
        // console.log(section);
        return <CarouselSection key={`carousel-${section.id}`} {...section} as={as} />;
      case 'page-components.gallery':
        return <GallerySection key={`gallery-${section.id}`} {...section} as={as} />;
      case 'page-components.page-title':
        return <PageTitleSection key={`page-title-${section.id}`} {...section} as={as} />;
      case 'page-components.embed-youtube':
        return <EmbedYoutubeSection key={`embed-youtube-${section.id}`} {...section} as={as} />;
      default:
        console.warn('Unknown component:', section);
        return null;
    }
  });
}
