import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadAllLevels, rootDir } from '../helpers';
import { validateLevelStructure } from '@/lib/puzzle-validation';
import { checkAnswer } from '@/lib/game-engine';

const levels = loadAllLevels();

describe('campaign data', () => {
  it('has exactly 100 levels in 5 chapters of 20', () => {
    expect(levels).toHaveLength(100);
    for (let c = 1; c <= 5; c++) expect(levels.filter((l) => l.chapter === c)).toHaveLength(20);
  });
  it('has unique ids and numbers 1..100', () => {
    expect(new Set(levels.map((l) => l.id)).size).toBe(100);
    expect(levels.map((l) => l.number).sort((a, b) => a - b)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
  });
  it('stores every answer as a six-digit string (leading zeros preserved)', () => {
    for (const l of levels) { expect(typeof l.answer).toBe('string'); expect(l.answer).toMatch(/^\d{6}$/); }
    const zeros = levels.filter((l) => l.answer.startsWith('0'));
    expect(zeros.length).toBeGreaterThan(0); // e.g. 070504, 061208, 050106
  });
  it('every level is complete: clues, 3 hints, steps, explanation naming the code, test cases', () => {
    for (const l of levels) {
      expect(l.clues.some((c) => c.kind === 'clue')).toBe(true);
      expect(l.hints).toHaveLength(3);
      expect(l.steps.length).toBeGreaterThan(0);
      expect(l.explanation).toContain(l.answer);
      expect(l.tests.length).toBeGreaterThanOrEqual(2);
    }
  });
  it('passes structural validation', () => {
    for (const l of levels) { const r = validateLevelStructure(l); expect({ n: l.number, issues: r.issues }).toEqual({ n: l.number, issues: [] }); }
  });
  it('test cases agree with the answer checker', () => {
    for (const l of levels) for (const t of l.tests) expect(checkAnswer(t.code, l)).toBe(t.correct);
  });
  it('never leaks the answer into player-visible text or early hints', () => {
    for (const l of levels) {
      const visible = [l.story, l.instructions, ...l.clues.map((c) => c.text), ...l.visuals.flatMap((v) => v.lines), l.hints[0], l.hints[1]].join('\n');
      expect(visible.includes(l.answer)).toBe(false);
    }
  });
  it('uses varied mechanics (many distinct categories)', () => {
    expect(new Set(levels.map((l) => l.category)).size).toBeGreaterThan(40);
  });
  it('clues pin down exactly ONE code per level (exhaustive search) and match the stored answer', async () => {
    const mod = await import(/* @vite-ignore */ pathToFileURL(join(rootDir, 'scripts', 'levels-source.mjs')).href);
    const rebuilt = mod.buildAll() as { number: number; answer: string }[]; // throws if any level has 0 or 2+ solutions
    expect(rebuilt).toHaveLength(100);
    for (const r of rebuilt) expect(levels.find((l) => l.number === r.number)?.answer).toBe(r.answer);
  }, 300000);
});
