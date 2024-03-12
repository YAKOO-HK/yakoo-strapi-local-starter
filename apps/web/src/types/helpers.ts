import { forwardRef } from 'react';

export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

// Reference: https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

// eslint-disable-next-line @typescript-eslint/ban-types
export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return forwardRef(render) as any;
}
