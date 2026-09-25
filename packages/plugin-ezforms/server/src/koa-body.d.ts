import type { Request as KoaRequest } from 'koa';

declare module 'koa' {
  interface Request extends KoaRequest {
    body?: any;
  }
}
