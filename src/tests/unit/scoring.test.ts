import { describe, it, expect } from 'vitest';
import { computeScore, computeStars, HINT_ALLOWANCE } from '@/lib/scoring';

describe('stars', () => {
  it('3 stars: no hints and within target', () => { expect(computeStars(0, 60, 90)).toBe(3); expect(computeStars(0, 90, 90)).toBe(3); });
  it('2 stars: late, or some hints', () => { expect(computeStars(0, 91, 90)).toBe(2); expect(computeStars(1, 10, 90)).toBe(2); expect(computeStars(2, 10, 90)).toBe(2); });
  it('1 star: all hints used', () => { expect(computeStars(HINT_ALLOWANCE, 5, 90)).toBe(1); });
});
describe('score', () => {
  it('applies penalties and a floor', () => {
    expect(computeScore(0, 0, 10, 90)).toBe(1000);
    expect(computeScore(1, 2, 10, 90)).toBe(1000 - 150 - 40);
    expect(computeScore(0, 0, 99, 90)).toBe(1000 - 3);
    expect(computeScore(3, 100, 9999, 90)).toBe(100);
  });
});
