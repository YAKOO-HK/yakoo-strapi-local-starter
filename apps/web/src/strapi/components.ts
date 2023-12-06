import { StrapiMedia } from './strapi';

export type ComponentLayout = 'full-width' | 'container' | 'prose';

export type ComponentHeroSection = {
  id: number;
  __component: 'page-components.hero-section';
  title: string;
  tagline: string | null;
  content: any | null;
  bgColor: string | null;
  image: {
    data: StrapiMedia;
  };
  buttonLink: string | null;
  buttonText: string | null;
};

export type ComponentRichText = {
  id: number;
  __component: 'page-components.rich-text';
  layout: ComponentLayout;
  content: any; // TODO: fix this
};

export type ComponentFeatureImage = {
  id: number;
  __component: 'page-components.feature-image';
  layout: ComponentLayout;
  image: {
    data: StrapiMedia;
  };
};

export type ComponentSlide = {
  id: number;
  __component: 'page-components.slide';
  title: string | null;
  caption: string | null;
  link: string | null;
  image: {
    data: StrapiMedia;
  };
};
export type ComponentCarousel = {
  id: number;
  __component: 'page-components.carousel';
  slides: Array<ComponentSlide>;
};

export type PageComponent = ComponentHeroSection | ComponentRichText | ComponentFeatureImage | ComponentCarousel;
