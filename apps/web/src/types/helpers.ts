export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

// Reference: https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
