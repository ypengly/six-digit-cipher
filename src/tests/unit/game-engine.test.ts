import { describe, it, expect } from 'vitest';
import { checkAnswer, isValidCode, toPublicLevel, wrongMessage, WRONG_MESSAGES } from '@/lib/game-engine';
import { submitSchema } from '@/lib/validation';
import { loadAllLevels } from '../helpers';

describe('code handling', () => {
  it('requires exactly six digits', () => {
    for (const bad of ['', '1', '12345', '1234567', '12345a', ' 12345', '12 345', '١٢٣٤٥٦']) expect(isValidCode(bad)).toBe(false);
    expect(isValidCode('004281')).toBe(true);
    expect(isValidCode(4281)).toBe(false); // numbers are never accepted: leading zeros would be lost
  });
  it('keeps leading zeros', () => {
    expect(checkAnswer('004281', { answer: '004281' })).toBe(true);
    expect(checkAnswer('4281', { answer: '004281' })).toBe(false);
    expect(checkAnswer('004282', { answer: '004281' })).toBe(false);
  });
  it('supports formally defined alternative answers only when listed', () => {
    expect(checkAnswer('111111', { answer: '123456', altAnswers: ['111111'] })).toBe(true);
    expect(checkAnswer('222222', { answer: '123456', altAnswers: ['111111'] })).toBe(false);
  });
  it('submit schema rejects bad codes and accepts leading zeros', () => {
    expect(submitSchema.safeParse({ levelNumber: 1, code: '12345' }).success).toBe(false);
    expect(submitSchema.safeParse({ levelNumber: 1, code: 'abcdef' }).success).toBe(false);
    expect(submitSchema.safeParse({ levelNumber: 1, code: 641106 }).success).toBe(false);
    expect(submitSchema.safeParse({ levelNumber: 1, code: '004281' }).success).toBe(true);
    expect(submitSchema.safeParse({ code: '004281' }).success).toBe(false);
    expect(submitSchema.safeParse({ levelNumber: 1, daily: '2026-01-01', code: '004281' }).success).toBe(false);
  });
});

describe('answer protection', () => {
  const levels = loadAllLevels();
  it('public level contains no secrets', () => {
    for (const l of levels) {
      const p = JSON.stringify(toPublicLevel(l));
      expect(p.includes(l.answer)).toBe(false);
      expect(p.includes(l.explanation)).toBe(false);
      expect(Object.keys(toPublicLevel(l))).not.toContain('answer');
      expect(Object.keys(toPublicLevel(l))).not.toContain('hints');
      expect(Object.keys(toPublicLevel(l))).not.toContain('steps');
    }
  });
  it('wrong-answer messages never reveal any code', () => {
    for (let i = 0; i < 12; i++) expect(wrongMessage(i)).not.toMatch(/\d{3,}/);
    expect(WRONG_MESSAGES.length).toBeGreaterThan(1);
  });
});
