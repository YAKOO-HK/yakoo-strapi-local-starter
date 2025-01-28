import * as React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { env } from '@/env';

export interface ControlledHCaptchaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>,
    Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  hCaptchaRef?: React.RefObject<HCaptcha>;
}

function ControlledHCaptcha<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  hCaptchaRef,
  ...props
}: ControlledHCaptchaProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, onBlur } }) => (
        <FormItem {...props}>
          <FormControl>
            {React.createElement(HCaptcha, {
              // temp solution after ts5.0 breaks HCaptcha
              sitekey: env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
              onVerify: (token, _ekey) => {
                // console.log(token, _ekey);
                onChange(token);
                onBlur();
              },
              ref: hCaptchaRef,
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { ControlledHCaptcha };
