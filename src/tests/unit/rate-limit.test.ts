import { describe, it, expect } from 'vitest';
import { rateLimit, resetRateLimits } from '@/lib/rate-limit';

describe('rate limit', () => {
  it('blocks after the limit and recovers after the window', () => {
    resetRateLimits();
    for (let i = 0; i < 3; i++) expect(rateLimit('k', 3, 1000, 0).allowed).toBe(true);
    const r = rateLimit('k', 3, 1000, 10);
    expect(r.allowed).toBe(false); expect(r.retryAfterSec).toBeGreaterThan(0);
    expect(rateLimit('k', 3, 1000, 1500).allowed).toBe(true);
    expect(rateLimit('other', 3, 1000, 10).allowed).toBe(true);
  });
});
