import type { ControllerProps, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ControlledDropdownProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<React.ComponentProps<typeof Select>, 'name' | 'defaultValue'> {
  allowEmpty?: boolean;
  emptyValue?: string;
  disabled?: boolean;
  loading?: boolean;
  init?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  contentProps?: React.ComponentProps<typeof SelectContent>;
  triggerProps?: React.ComponentProps<typeof SelectTrigger>;
  labelProps?: React.ComponentProps<typeof FormLabel>;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
}

export const ControlledDropdown = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  allowEmpty = true,
  emptyValue = '__empty__',
  disabled = false,
  loading = false,
  options = [],
  placeholder,
  label,
  className,
  contentProps,
  triggerProps,
  labelProps,
  helperText,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init,
  ...props
}: ControlledDropdownProps<TFieldValues, TName>) => {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { value, onChange, onBlur } }) => (
        <FormItem className={cn('group', className)}>
          {label && <FormLabel {...labelProps}>{label}</FormLabel>}
          <Select
            {...props}
            disabled={loading || disabled}
            onValueChange={(v) => {
              /* if allowEmpty and the emptyValue is the selected item, we update it as empty string instead */
              if (allowEmpty && v === emptyValue) {
                onChange('');
              } else {
                onChange(v as PathValue<TFieldValues, TName>);
              }
            }}
            name={name}
            value={(typeof value === 'number' || typeof value === 'boolean' ? `${value}` : value) || ''}
            onOpenChange={(open) => {
              if (!open) {
                onBlur();
              }
            }}
          >
            <FormControl>
              <SelectTrigger {...triggerProps}>
                <SelectValue placeholder={loading ? 'Loading...' : placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent {...contentProps}>
              {allowEmpty ? <SelectItem value={emptyValue}>&nbsp;</SelectItem> : null}
              {options?.map((row) => (
                <SelectItem key={row.value} value={row.value}>
                  {row.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};
