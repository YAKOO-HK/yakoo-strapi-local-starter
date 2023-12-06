import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { getHomepage } from '@/strapi/homepage';

export default async function Home() {
  const { attributes } = await getHomepage();
  return (
    <Main>
      <DynamicZone sections={attributes.sections} />
    </Main>
  );
}
