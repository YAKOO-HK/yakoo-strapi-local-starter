import { PageComponent } from '@/strapi/components';
import { CarouselSection } from './sections/carousel';
import { FeatureImageSection } from './sections/feature-image';
import { HeroSection } from './sections/hero-section';
import { RichTextSection } from './sections/rich-text';

export function DynamicZone({ sections }: { sections: PageComponent[] }) {
  return sections.map((section) => {
    switch (section.__component) {
      case 'page-components.rich-text':
        return <RichTextSection key={`rich-text-${section.id}`} {...section} />;
      case 'page-components.hero-section':
        return <HeroSection key={`hero-section-${section.id}`} {...section} />;
      case 'page-components.feature-image':
        return <FeatureImageSection key={`feature-image-${section.id}`} {...section} />;
      case 'page-components.carousel':
        // console.log(section);
        return <CarouselSection key={`carousel-${section.id}`} {...section} />;
      default:
        console.warn('Unknown component:', section);
        return null;
    }
  });
}
