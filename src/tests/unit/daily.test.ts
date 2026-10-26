import { describe, it, expect } from 'vitest';
import { generateDaily, generateDailyDetailed, countSolutions } from '@/lib/daily';
import { hashString, mulberry32 } from '@/lib/random';

describe('seeded randomness', () => {
  it('same seed gives the same sequence', () => {
    const a = mulberry32(42), b = mulberry32(42);
    expect(Array.from({ length: 5 }, a)).toEqual(Array.from({ length: 5 }, b));
    expect(hashString('2026-10-20')).toBe(hashString('2026-10-20'));
    expect(hashString('2026-10-20')).not.toBe(hashString('2026-10-21'));
  });
});

describe('daily challenge', () => {
  it('is reproducible from its date and salt', () => {
    expect(generateDaily('2026-12-01', 's')).toEqual(generateDaily('2026-12-01', 's'));
  });
  it('differs between dates', () => {
    expect(generateDaily('2026-12-01', 's').instanceId).not.toBe(generateDaily('2026-12-02', 's').instanceId);
  });
  it('always yields a six-digit string answer and records its seed in the instance id', () => {
    for (const d of ['2026-01-01', '2026-02-14', '2026-07-04']) {
      const p = generateDaily(d, 'x');
      expect(p.answer).toMatch(/^\d{6}$/);
      expect(p.instanceId).toContain(String(p.seed));
      expect(p.clues.length).toBeGreaterThan(2);
    }
  });
  it('has exactly one solution (ambiguous puzzles are rejected)', () => {
    const { puzzle, clues } = generateDailyDetailed('2026-03-03', 'y');
    expect(countSolutions(clues, 5)).toBe(1);
    expect(clues.every((c) => c.test(puzzle.answer.split('').map(Number)))).toBe(true); // every clue is true of the answer
  });
});
