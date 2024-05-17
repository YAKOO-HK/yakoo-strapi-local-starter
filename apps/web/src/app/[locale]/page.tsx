import { type Metadata } from 'next';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { LeafletMap } from '@/components/leaflet';
import { env } from '@/env';
import { getHomepage } from '@/strapi/homepage';
import { StrapiLocale } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { locale: StrapiLocale } }) {
  return {
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}`,
      languages: {
        en: params.locale !== 'en' ? `${env.NEXT_PUBLIC_SITE_URL}/en` : undefined,
        'zh-Hant': params.locale !== 'zh-Hant' ? `${env.NEXT_PUBLIC_SITE_URL}/zh-Hant` : undefined,
      },
    },
  } satisfies Metadata;
}

export default async function Home({ params }: { params: { locale: StrapiLocale } }) {
  const { attributes } = await getHomepage(params.locale);
  const { map } = attributes;
  return (
    <Main>
      <DynamicZone sections={attributes.sections} locale={params.locale} />
      {map ? (
        <LeafletMap
          center={{ lat: map.lat, lng: map.lng }}
          zoom={map.zoom}
          markers={map.markers?.map((marker) => ({
            position: { lat: marker.lat, lng: marker.lng },
            popupProps: { children: <BlocksRenderer content={marker.popupContent} /> },
          }))}
        />
      ) : null}
    </Main>
  );
}
