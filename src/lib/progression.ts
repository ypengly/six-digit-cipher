import type { ProgressMap, Summary } from '@/types/progress';

export const TOTAL_LEVELS = 100;

export function isUnlocked(levelNumber: number, progress: ProgressMap): boolean {
  if (levelNumber < 1 || levelNumber > TOTAL_LEVELS) return false;
  if (levelNumber === 1) return true;
  return !!progress[levelNumber - 1]?.completed || !!progress[levelNumber]?.completed;
}
export const highestUnlocked = (progress: ProgressMap) => {
  let n = 1;
  while (n < TOTAL_LEVELS && progress[n]?.completed) n++;
  return n;
};
export const nextLevel = (n: number) => (n < TOTAL_LEVELS ? n + 1 : null);
export const campaignPercent = (progress: ProgressMap) =>
  Math.round((Object.values(progress).filter((p) => p.completed).length / TOTAL_LEVELS) * 100);

export function summarise(progress: ProgressMap): Summary {
  const rows = Object.entries(progress).map(([n, p]) => ({ n: Number(n), ...p }));
  let streak = 0, best = 0;
  for (let n = 1; n <= TOTAL_LEVELS; n++) {
    const p = progress[n];
    if (p?.completed && p.hintsUsed === 0) { streak++; best = Math.max(best, streak); } else streak = 0;
  }
  return {
    completedCount: rows.filter((r) => r.completed).length,
    totalStars: rows.reduce((a, r) => a + (r.completed ? r.stars : 0), 0),
    totalAttempts: rows.reduce((a, r) => a + r.attempts, 0),
    totalHints: rows.reduce((a, r) => a + r.hintsUsed, 0),
    bestStreak: best,
  };
}
