import type { Schema, Struct } from '@strapi/strapi';

export interface FormComponentsSelect extends Struct.ComponentSchema {
  collectionName: 'components_form_components_selects';
  info: {
    displayName: 'Select';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.JSON & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface FormComponentsTextInput extends Struct.ComponentSchema {
  collectionName: 'components_form_components_text_inputs';
  info: {
    displayName: 'Text Input';
    icon: 'pencil';
  };
  attributes: {
    label: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    regExp: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<['text', 'password', 'number', 'email', 'tel', 'url']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface FormComponentsTextarea extends Struct.ComponentSchema {
  collectionName: 'components_form_components_textareas';
  info: {
    displayName: 'Textarea';
    icon: 'quote';
  };
  attributes: {
    label: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface MapMap extends Struct.ComponentSchema {
  collectionName: 'components_map_maps';
  info: {
    description: '';
    displayName: 'Map';
    icon: 'globe';
  };
  attributes: {
    lat: Schema.Attribute.Float & Schema.Attribute.Required;
    lng: Schema.Attribute.Float & Schema.Attribute.Required;
    markers: Schema.Attribute.Component<'map.marker', true>;
    zoom: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 20;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<16>;
  };
}

export interface MapMarker extends Struct.ComponentSchema {
  collectionName: 'components_map_markers';
  info: {
    description: '';
    displayName: 'Marker';
    icon: 'pinMap';
  };
  attributes: {
    lat: Schema.Attribute.Float & Schema.Attribute.Required;
    lng: Schema.Attribute.Float & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    popupContent: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface PageComponentsCarousel extends Struct.ComponentSchema {
  collectionName: 'components_page_components_carousels';
  info: {
    description: '';
    displayName: 'Carousel';
    icon: 'slideshow';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['full-width', 'container', 'prose']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full-width'>;
    slides: Schema.Attribute.Component<'page-components.slide', true> & Schema.Attribute.Required;
  };
}

export interface PageComponentsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_page_components_contact_forms';
  info: {
    displayName: 'Contact Form';
    icon: 'information';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['full-width', 'container', 'prose']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'container'>;
  };
}

export interface PageComponentsEmbedYoutube extends Struct.ComponentSchema {
  collectionName: 'components_page_components_embed_youtubes';
  info: {
    description: '';
    displayName: 'Embed Youtube';
    icon: 'cast';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['full-width', 'container', 'prose']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'container'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageComponentsFeatureImage extends Struct.ComponentSchema {
  collectionName: 'components_page_components_feature_images';
  info: {
    displayName: 'Feature Image';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['full-width', 'container']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full-width'>;
  };
}

export interface PageComponentsGallery extends Struct.ComponentSchema {
  collectionName: 'components_page_components_galleries';
  info: {
    description: '';
    displayName: 'Gallery';
    icon: 'landscape';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['full-width', 'container', 'prose']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'prose'>;
    slides: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface PageComponentsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_page_components_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
    icon: 'priceTag';
  };
  attributes: {
    arrangement: Schema.Attribute.Enumeration<['image-first', 'image-last']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'image-first'>;
    bgColor: Schema.Attribute.String & Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    buttonLink: Schema.Attribute.String;
    buttonText: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Read More'>;
    content: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['full-width', 'container']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'container'>;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageComponentsHtml extends Struct.ComponentSchema {
  collectionName: 'components_page_components_htmls';
  info: {
    description: '';
    displayName: 'HTML';
    icon: 'code';
  };
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'rich';
        }
      >;
  };
}

export interface PageComponentsPageTitle extends Struct.ComponentSchema {
  collectionName: 'components_page_components_page_titles';
  info: {
    description: '';
    displayName: 'Page Title';
    icon: 'pin';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['container', 'prose']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'container'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageComponentsRichText extends Struct.ComponentSchema {
  collectionName: 'components_page_components_rich_texts';
  info: {
    description: '';
    displayName: 'Rich Text (blocks)';
    icon: 'file';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['full-width', 'container', 'prose']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'container'>;
  };
}

export interface PageComponentsSlide extends Struct.ComponentSchema {
  collectionName: 'components_page_components_slides';
  info: {
    displayName: 'Slide';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedMetaSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    socialNetwork: Schema.Attribute.Enumeration<['Facebook', 'Twitter']> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 10;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Schema.Attribute.String;
    metaSocial: Schema.Attribute.Component<'shared.meta-social', true>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'form-components.select': FormComponentsSelect;
      'form-components.text-input': FormComponentsTextInput;
      'form-components.textarea': FormComponentsTextarea;
      'map.map': MapMap;
      'map.marker': MapMarker;
      'page-components.carousel': PageComponentsCarousel;
      'page-components.contact-form': PageComponentsContactForm;
      'page-components.embed-youtube': PageComponentsEmbedYoutube;
      'page-components.feature-image': PageComponentsFeatureImage;
      'page-components.gallery': PageComponentsGallery;
      'page-components.hero-section': PageComponentsHeroSection;
      'page-components.html': PageComponentsHtml;
      'page-components.page-title': PageComponentsPageTitle;
      'page-components.rich-text': PageComponentsRichText;
      'page-components.slide': PageComponentsSlide;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
