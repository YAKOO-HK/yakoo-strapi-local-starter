import type { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

export function getIp(req: NextRequest) {
  return req.ip || req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
}

export function rateLimitByIp(limit: number, ttl: number = 60000) {
  const tokenCache = new LRUCache<string, number>({
    max: 500,
    ttl,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
  });
  return {
    getRemaining: (req: NextRequest) => {
      tokenCache.purgeStale();
      const ip = getIp(req);
      let tokenCount = tokenCache.get(ip);
      if (!tokenCount) {
        tokenCount = 0;
      }
      tokenCount += 1;
      // console.log(`IP ${ip} has ${tokenCount} requests`);
      tokenCache.set(ip, tokenCount);
      return limit - tokenCount;
    },
  };
}
