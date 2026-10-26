import { describe, it, expect } from 'vitest';
import { loadAllLevels } from '../helpers';
import { checkAnswer } from '@/lib/game-engine';
import { isUnlocked } from '@/lib/progression';
import { computeStars } from '@/lib/scoring';
import { evaluateAchievements } from '@/data/achievements';
import type { ProgressMap } from '@/types/progress';

describe('full campaign playthrough (engine level)', () => {
  const levels = loadAllLevels().sort((a, b) => a.number - b.number);

  it('Level 1 to Level 100 can be completed in order, and shortcuts are blocked', () => {
    const progress: ProgressMap = {};
    for (const l of levels) {
      expect(isUnlocked(l.number, progress)).toBe(true);
      if (l.number < 100) expect(isUnlocked(l.number + 1, progress)).toBe(false); // next door still shut
      const wrong = l.answer.slice(0, 5) + String((Number(l.answer[5]) + 1) % 10);
      expect(checkAnswer(wrong, l)).toBe(false);          // a near miss never opens the door
      expect(checkAnswer(l.answer, l)).toBe(true);
      progress[l.number] = { completed: true, stars: computeStars(0, 10, l.estSeconds), attempts: 2, hintsUsed: 0, bestTimeSec: 10, score: 900 };
    }
    expect(Object.values(progress).filter((p) => p.completed)).toHaveLength(100);
    expect(evaluateAchievements(progress)).toContain('escape');
  });

  it('a correct answer for the wrong level does not pass', () => {
    const [a, b] = [levels[0], levels[1]];
    if (a.answer !== b.answer) expect(checkAnswer(a.answer, b)).toBe(false);
  });
});
