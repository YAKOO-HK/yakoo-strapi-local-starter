import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { getHomepage } from '@/strapi/homepage';
import { StrapiLocale } from '@/strapi/strapi';

export default async function Home({ params }: { params: { locale: StrapiLocale } }) {
  const { attributes } = await getHomepage(params.locale);
  return (
    <Main>
      <DynamicZone sections={attributes.sections} />
    </Main>
  );
}
