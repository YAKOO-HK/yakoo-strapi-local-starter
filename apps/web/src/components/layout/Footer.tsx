import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('layout');
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-6">
        <p className="text-center text-xs md:text-right">
          {t.rich('poweredBy', {
            a: (chunks) => <a href="https://github.com/YAKOO-HK/yakoo-strapi-local-starter">{chunks}</a>,
          })}
        </p>
      </div>
    </footer>
  );
}
