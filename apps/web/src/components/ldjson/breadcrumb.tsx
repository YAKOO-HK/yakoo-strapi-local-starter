import { BreadcrumbList, WithContext } from 'schema-dts';

export function SingleBreadcrumbLdJson({
  itemList,
}: {
  itemList: Array<Omit<BreadcrumbList['itemListElement'], '@type' | 'position'>>;
}) {
  if (!itemList || !itemList.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: itemList.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            ...item,
          })),
        } satisfies WithContext<BreadcrumbList>),
      }}
    />
  );
}
