import * as React from 'react';
import { Turnstile, type TurnstileInstance, type TurnstileProps } from '@marsidev/react-turnstile';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { env } from '@/env';

export interface ControlledTurnstileProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>,
    Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  options?: TurnstileProps['options'];
  captchaRef?: React.RefObject<TurnstileInstance>;
}

function ControlledTurnstile<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  options,
  captchaRef,
  ...props
}: ControlledTurnstileProps<TFieldValues, TName>) {
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
            <Turnstile
              siteKey={env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
              options={options}
              onSuccess={(token) => {
                onChange(token);
                onBlur();
              }}
              ref={captchaRef}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { ControlledTurnstile };
