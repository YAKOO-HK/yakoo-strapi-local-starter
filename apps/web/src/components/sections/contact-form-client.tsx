'use client';

import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { ControlledHCaptcha } from '@/components/form/ControlledHCaptcha';
import { ControlledTextarea } from '@/components/form/ControlledTextarea';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { env } from '@/env';
import type { FormComponent } from '@/strapi/components';

function getDefaultValues({ sections }: { sections: Array<FormComponent> }) {
  const defaultValues: { [key: string]: any } = {
    hCaptcha: '',
  };
  return sections.reduce((acc, section) => {
    switch (section.__component) {
      case 'form-components.text-input':
      case 'form-components.textarea':
      case 'form-components.select':
      default:
        return { ...acc, [section.name]: '' };
    }
  }, defaultValues);
}

export function ContactForm({ sections }: { sections: Array<FormComponent> }) {
  const hCaptchaRef = useRef<HCaptcha>(null);
  const methods = useForm({
    defaultValues: getDefaultValues({ sections }),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  return (
    <Form {...methods}>
      <form
        className="border-border rounded-lg border"
        onSubmit={handleSubmit(async ({ hCaptcha, ...formData }) => {
          const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/ezforms/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formName: 'contact-form',
              formData,
              token: hCaptcha,
            }),
          });
          hCaptchaRef.current?.resetCaptcha();
          if (response.ok) {
            toast({ description: 'Thank you for your submission! We will be in touch soon.' });
            reset(getDefaultValues({ sections }));
          } else {
            toast({ description: 'Something went wrong. Please try again later.', variant: 'destructive' });
          }
        })}
      >
        <div className="@lg:grid-cols-2 @lg:gap-x-8 @lg:px-8 grid grid-cols-1 gap-y-6 px-2 py-6">
          {sections.map((section) => {
            switch (section.__component) {
              case 'form-components.text-input':
                return (
                  <ControlledTextField
                    key={`text-input_${section.id}`}
                    control={control}
                    name={section.name}
                    label={section.label}
                    placeholder={section.placeholder || undefined}
                    required={section.required || false}
                    type={section.type}
                    rules={section.required ? { required: 'Required.' } : undefined}
                  />
                );
              case 'form-components.textarea':
                return (
                  <ControlledTextarea
                    key={`textarea_${section.id}`}
                    control={control}
                    name={section.name}
                    label={section.label}
                    placeholder={section.placeholder || undefined}
                    required={section.required || false}
                    rules={section.required ? { required: 'Required.' } : undefined}
                  />
                );
              case 'form-components.select':
                return (
                  <ControlledDropdown
                    key={`select_${section.id}`}
                    control={control}
                    name={section.name}
                    label={section.label}
                    placeholder={section.placeholder || undefined}
                    required={section.required || false}
                    options={section.options}
                    rules={section.required ? { required: 'Required.' } : undefined}
                  />
                );
              default:
                return null;
            }
          })}
          <ControlledHCaptcha
            control={control}
            name="hCaptcha"
            hCaptchaRef={hCaptchaRef}
            rules={{ required: 'Required.' }}
          />
        </div>
        <div className="@lg:px-8 px-2 pb-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            <span>Submit</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
