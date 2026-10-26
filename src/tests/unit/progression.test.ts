import { describe, it, expect } from 'vitest';
import { highestUnlocked, isUnlocked, summarise, campaignPercent } from '@/lib/progression';
import { evaluateAchievements } from '@/data/achievements';
import type { ProgressMap } from '@/types/progress';

const done = (stars = 3, hints = 0, attempts = 1) => ({ completed: true, stars, attempts, hintsUsed: hints, bestTimeSec: 30, score: 900 });

describe('progression', () => {
  it('only level 1 is open at the start; locked levels stay locked', () => {
    expect(isUnlocked(1, {})).toBe(true);
    for (const n of [2, 3, 50, 100]) expect(isUnlocked(n, {})).toBe(false);
    expect(isUnlocked(0, {})).toBe(false); expect(isUnlocked(101, {})).toBe(false);
  });
  it('solving a level unlocks the next only', () => {
    const p: ProgressMap = { 1: done() };
    expect(isUnlocked(2, p)).toBe(true); expect(isUnlocked(3, p)).toBe(false);
    expect(highestUnlocked(p)).toBe(2);
  });
  it('summarises totals and the no-hint streak', () => {
    const p: ProgressMap = { 1: done(3, 0), 2: done(2, 1), 3: done(3, 0), 4: done(3, 0) };
    const s = summarise(p);
    expect(s.completedCount).toBe(4); expect(s.totalStars).toBe(11); expect(s.totalHints).toBe(1); expect(s.bestStreak).toBe(2);
    expect(campaignPercent(p)).toBe(4);
  });
  it('awards achievements from progress', () => {
    const p: ProgressMap = {}; for (let n = 1; n <= 20; n++) p[n] = done();
    const ids = evaluateAchievements(p);
    for (const id of ['first-lock', 'ten-down', 'chapter-1', 'clean-five', 'clean-twenty', 'perfect-chapter']) expect(ids).toContain(id);
    expect(ids).not.toContain('escape');
    expect(evaluateAchievements({}, { daily: 1 })).toContain('daily');
  });
});
