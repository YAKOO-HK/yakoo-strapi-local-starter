import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiMedia } from './strapi';

export type ComponentLayout = 'full-width' | 'container' | 'prose';

export type ComponentHeroSection = {
  id: number;
  __component: 'page-components.hero-section';
  layout: ComponentLayout;
  title: string;
  tagline: string | null;
  content: BlocksContent | null;
  bgColor: string | null;
  image: {
    data: StrapiMedia;
  };
  buttonLink: string | null;
  buttonText: string | null;
  arrangement: 'image-first' | 'image-last';
};

export type ComponentPageTitle = {
  id: number;
  __component: 'page-components.page-title';
  layout: ComponentLayout;
  title: string;
};

export type ComponentRichText = {
  id: number;
  __component: 'page-components.rich-text';
  layout: ComponentLayout;
  content: BlocksContent;
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
  layout: ComponentLayout;
  slides: Array<ComponentSlide>;
};

export type ComponentGallery = {
  id: number;
  __component: 'page-components.gallery';
  layout: ComponentLayout;
  slides: { data: Array<StrapiMedia> };
};

export type ComponentEmbedYoutube = {
  id: number;
  __component: 'page-components.embed-youtube';
  layout: ComponentLayout;
  url: string;
};

export type ComponentHTML = {
  id: number;
  __component: 'page-components.html';
  content: string;
};

export type ComponentContactForm = {
  id: number;
  __component: 'page-components.contact-form';
  layout: ComponentLayout;
};

export type PageComponent =
  | ComponentPageTitle
  | ComponentHeroSection
  | ComponentRichText
  | ComponentFeatureImage
  | ComponentCarousel
  | ComponentGallery
  | ComponentEmbedYoutube
  | ComponentHTML
  | ComponentContactForm;

export type FormTextInput = {
  id: number;
  __component: 'form-components.text-input';
  name: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number';
  label: string | null;
  placeholder: string | null;
  required: boolean | null;
  regExp: string | null;
};
export type FormTextarea = {
  id: number;
  __component: 'form-components.textarea';
  name: string;
  label: string | null;
  placeholder: string | null;
  required: boolean | null;
};
export type FormSelect = {
  id: number;
  __component: 'form-components.select';
  name: string;
  label: string | null;
  placeholder: string | null;
  required: boolean | null;
  options: Array<{ value: string; label: string }>;
};

export type FormComponent = FormTextInput | FormTextarea | FormSelect;
