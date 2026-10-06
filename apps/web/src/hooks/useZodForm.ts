import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldPath, type FieldValues, type UseFormProps, type UseFormSetError } from 'react-hook-form';
import * as z from 'zod';

function convertError(zodErrors?: z.core.$ZodIssue[]) {
  const errors: Record<string, string> = {};
  // console.log(zodErrors);
  zodErrors?.forEach((r) => {
    const field = r.path?.join('.') || 'root';
    errors[field] = r.message;
  });
  return errors;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  T extends z.core.$ZodType<Output, Input>,
  Input extends FieldValues = FieldValues,
  Output = z.infer<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Context = any,
> = UseFormProps<Input, Context, Output> & {
  zodSchema: Parameters<typeof zodResolver<Input, Context, Output, T>>[0];
  onSubmit?: (data: Output) => unknown | Promise<unknown>;
  onError?: (errors: Record<string, string>, e: unknown) => unknown;
};

function useZodForm<
  T extends z.core.$ZodType<Output, Input>,
  Input extends FieldValues = FieldValues,
  Output = z.infer<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Context = any,
>({ onSubmit, onError, zodSchema, ...props }: useZodFormProps<T, Input, Output, Context>) {
  const { handleSubmit, setError, clearErrors, ...form } = useForm({
    resolver: zodResolver<Input, Context, Output>(zodSchema),
    ...props,
  });

  const wrapOnSubmit = handleSubmit(
    React.useCallback(
      async (values: Output) => {
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
    onFormSubmit: (e?: React.SubmitEvent) => {
      e?.stopPropagation();
      clearErrors();
      return wrapOnSubmit(e);
    },
  };
}
export { useZodForm };
