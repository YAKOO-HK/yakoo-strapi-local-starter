export function LdJson({ structuredData }: { structuredData: unknown | null }) {
  if (!structuredData) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
