'use client';

import * as React from 'react';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea, TextareaProps } from '@/components/ui/textarea';

export type ControlledTextareaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = TextareaProps &
  Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
    label?: React.ReactNode;
    helperText?: React.ReactNode;
    description?: React.ReactNode;
    rows?: number;
    disabled?: boolean;
    fieldProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
  };

export function ControlledTextarea<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  defaultValue,
  shouldUnregister,
  rules,
  helperText,
  fieldProps,
  description,
  ...props
}: ControlledTextareaProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FormItem {...fieldProps}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
}
