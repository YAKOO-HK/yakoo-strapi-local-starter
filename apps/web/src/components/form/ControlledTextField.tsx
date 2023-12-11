import { ReactNode } from 'react';
import { FieldPath, FieldValues, type ControllerProps } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';

export interface ControlledTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<InputProps, 'name' | 'defaultValue'> {
  label?: ReactNode;
  helperText?: ReactNode;
  description?: ReactNode;
  fieldProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
}

function ControlledTextField<
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
  description,
  fieldProps,
  ...props
}: ControlledTextFieldProps<TFieldValues, TName>) {
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
            <Input {...props} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
}

export { ControlledTextField };
