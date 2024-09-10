import { cn } from '@/lib/utils';
import { ComponentContactForm, DynamicZoneSectionProps } from '@/strapi/components';
import { getContactForm } from '@/strapi/contact-form';
import { ContactForm } from './contact-form-client';

export async function ContactFormSection({
  layout,
  locale,
  as = 'div',
}: Omit<ComponentContactForm, 'id' | '__component'> & DynamicZoneSectionProps) {
  const Component = as;
  const contactForm = await getContactForm();
  return (
    <Component
      className={cn('py-8 @container', {
        container: layout === 'container',
        'mx-auto max-w-prose': layout === 'prose',
      })}
    >
      <ContactForm sections={contactForm.attributes.sections} locale={locale} />
    </Component>
  );
}
