import * as React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';

export type ZodFormProps<
  TFieldValues extends FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> = React.HtmlHTMLAttributes<HTMLFormElement> &
  UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
    t?: (key: string) => string;
    formId?: string;
    formControl?: unknown;
    onFormSubmit: (e: React.SubmitEvent) => unknown | Promise<unknown>;
    children?: React.ReactNode;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ZodForm = <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>({
  t,
  formId,
  onFormSubmit,
  children,
  watch,
  getValues,
  getFieldState,
  setError,
  clearErrors,
  setValue,
  trigger,
  formState,
  resetField,
  reset,
  handleSubmit,
  unregister,
  control,
  register,
  setFocus,
  subscribe,
  setValues,
  resetDefaultValues,
  getErrors,
  ...props
}: ZodFormProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <Form
      t={t}
      formId={formId}
      watch={watch}
      getValues={getValues}
      getFieldState={getFieldState}
      setError={setError}
      clearErrors={clearErrors}
      setValue={setValue}
      trigger={trigger}
      formState={formState}
      resetField={resetField}
      reset={reset}
      handleSubmit={handleSubmit}
      unregister={unregister}
      control={control}
      register={register}
      setFocus={setFocus}
      subscribe={subscribe}
      setValues={setValues}
      resetDefaultValues={resetDefaultValues}
      getErrors={getErrors}
    >
      <form onSubmit={onFormSubmit} {...props}>
        {children}
      </form>
    </Form>
  );
};

export { ZodForm };
