import { cn } from '@/lib/utils';
import { ComponentContactForm } from '@/strapi/components';
import { getContactForm } from '@/strapi/contact-form';
import { ContactForm } from './contact-form-client';

export async function ContactFormSection({
  layout,
  as = 'div',
}: Omit<ComponentContactForm, 'id' | '__component'> & { as?: 'div' | 'section' }) {
  const Component = as;
  const contactForm = await getContactForm();
  return (
    <Component
      className={cn('@container py-8', {
        container: layout === 'container',
        'mx-auto max-w-[65ch]': layout === 'prose',
      })}
    >
      <ContactForm sections={contactForm.attributes.sections} />
    </Component>
  );
}
