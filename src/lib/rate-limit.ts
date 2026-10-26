/** Fixed-window in-memory limiter. Good for a single Node process (local/dev/small deploys).
 *  Behind multiple instances, replace the Map with Redis or another shared store. */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    return { allowed: true, retryAfterSec: 0 };
  }
  b.count++;
  return b.count <= limit ? { allowed: true, retryAfterSec: 0 } : { allowed: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
}
export const resetRateLimits = () => buckets.clear();
