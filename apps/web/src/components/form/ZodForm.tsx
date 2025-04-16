/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';

export type ZodFormProps<TFieldValues extends FieldValues, TContext = any> = React.HtmlHTMLAttributes<HTMLFormElement> &
  UseFormReturn<TFieldValues, TContext> & {
    onFormSubmit: (e: React.FormEvent) => void | Promise<void>;
    children?: React.ReactNode;
  };

const ZodForm = <TFieldValues extends FieldValues, TContext = any>({
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
  ...props
}: ZodFormProps<TFieldValues, TContext>) => {
  return (
    <Form
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
    >
      <form onSubmit={onFormSubmit} {...props}>
        {children}
      </form>
    </Form>
  );
};

export { ZodForm };
