import React, { FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldPath, useForm, UseFormSetError, type FieldValues, type UseFormProps } from 'react-hook-form';
import * as z from 'zod';

function convertError(zodErrors?: z.ZodIssue[]) {
  const errors: Record<string, string> = {};
  // console.log(zodErrors);
  zodErrors?.forEach((r) => {
    const field = r.path?.join('.') || 'root';
    errors[field] = r.message;
  });
  return errors;
}

function handle422(e: any): Record<string, string> {
  if (e.response?.status === 422) {
    // axios status
    return convertError(e.response?.data);
  } else if (e.status === 422) {
    // from fetchResponseHandler
    return convertError(e.data);
  }
  return { root: e.toString() || 'Unknown Error.' };
}

function addServerErrors<TFieldValues extends FieldValues>(
  errors: Record<FieldPath<TFieldValues>, string>,
  setError: UseFormSetError<TFieldValues>
) {
  return Object.keys(errors ?? {}).forEach((key) => {
    setError(key as FieldPath<TFieldValues>, {
      type: 'server',
      message: errors[key as FieldPath<TFieldValues>],
    });
  });
}

export type useZodFormProps<
  TZodSchema extends z.Schema,
  TFieldValues extends FieldValues = z.infer<TZodSchema>,
  TContext = any,
> = UseFormProps<TFieldValues, TContext> & {
  zodSchema: TZodSchema;
  onSubmit?: (data: TFieldValues) => unknown | Promise<unknown>;
  onError?: (errors: Record<string, string>, e: unknown) => unknown;
};

function useZodForm<
  TZodSchema extends z.Schema,
  TFieldValues extends FieldValues = z.infer<TZodSchema>,
  TContext = any,
>({ onSubmit, onError, zodSchema, ...props }: useZodFormProps<TZodSchema, TFieldValues, TContext>) {
  const { handleSubmit, setError, clearErrors, ...form } = useForm<TFieldValues, TContext>({
    resolver: zodResolver(zodSchema),
    ...props,
  });

  const wrapOnSubmit = handleSubmit(
    React.useCallback(
      async (values: TFieldValues) => {
        try {
          return await onSubmit?.(values);
        } catch (e) {
          // console.log(e);
          const errors = handle422(e);
          addServerErrors(errors, setError);
          onError?.(errors, e);
        }
      },
      [onSubmit, onError, setError]
    )
  );

  return {
    ...form,
    handleSubmit,
    setError,
    clearErrors,
    onFormSubmit: (e?: FormEvent) => {
      e?.stopPropagation();
      clearErrors();
      return wrapOnSubmit(e);
    },
  };
}
export { useZodForm };
