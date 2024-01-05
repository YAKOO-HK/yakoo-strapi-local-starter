import { LRUCache } from 'lru-cache';

export function rateLimitByIp(limit: number, ttl: number = 60000) {
  const tokenCache = new LRUCache<string, number>({
    max: 500,
    ttl,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
  });
  return {
    getRemaining: (req: Request) => {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
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
