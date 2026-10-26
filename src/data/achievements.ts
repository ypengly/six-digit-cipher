import type { ProgressMap } from '@/types/progress';
import { summarise } from '@/lib/progression';

export interface AchievementDef { id: string; name: string; description: string; check: (p: ProgressMap, ctx?: { daily?: number }) => boolean }

const done = (p: ProgressMap, from: number, to: number) => { for (let n = from; n <= to; n++) if (!p[n]?.completed) return false; return true; };
const perfect = (p: ProgressMap, from: number, to: number) => { for (let n = from; n <= to; n++) if (p[n]?.stars !== 3) return false; return true; };

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-lock', name: 'First Lock', description: 'Solve Level 1.', check: (p) => !!p[1]?.completed },
  { id: 'ten-down', name: 'Ten Down', description: 'Solve 10 levels.', check: (p) => summarise(p).completedCount >= 10 },
  { id: 'half-way', name: 'Half-Way In', description: 'Solve 50 levels.', check: (p) => summarise(p).completedCount >= 50 },
  { id: 'chapter-1', name: 'Initiated', description: 'Finish Chapter 1.', check: (p) => done(p, 1, 20) },
  { id: 'chapter-2', name: 'Analyst', description: 'Finish Chapter 2.', check: (p) => done(p, 21, 40) },
  { id: 'chapter-3', name: 'Unfooled', description: 'Finish Chapter 3.', check: (p) => done(p, 41, 60) },
  { id: 'chapter-4', name: 'Out of the Labyrinth', description: 'Finish Chapter 4.', check: (p) => done(p, 61, 80) },
  { id: 'escape', name: 'Vault Escaped', description: 'Solve all 100 levels.', check: (p) => done(p, 1, 100) },
  { id: 'clean-five', name: 'Clean Hands', description: 'Solve 5 levels in a row without hints.', check: (p) => summarise(p).bestStreak >= 5 },
  { id: 'clean-twenty', name: 'Pure Reasoning', description: 'Solve 20 levels in a row without hints.', check: (p) => summarise(p).bestStreak >= 20 },
  { id: 'star-collector', name: 'Star Collector', description: 'Earn 100 stars.', check: (p) => summarise(p).totalStars >= 100 },
  { id: 'perfect-chapter', name: 'Flawless', description: 'Earn 3 stars on every level of a chapter.', check: (p) => [1, 21, 41, 61, 81].some((s) => perfect(p, s, s + 19)) },
  { id: 'first-try', name: 'First Try', description: 'Solve a level of Chapter 3 or later on your first attempt.', check: (p) => Object.entries(p).some(([n, v]) => Number(n) > 40 && v.completed && v.attempts === 1) },
  { id: 'daily', name: 'Daily Ritual', description: 'Solve a Daily Challenge.', check: (_p, ctx) => (ctx?.daily ?? 0) >= 1 },
];
export const achievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id);
export const evaluateAchievements = (p: ProgressMap, ctx?: { daily?: number }) => ACHIEVEMENTS.filter((a) => a.check(p, ctx)).map((a) => a.id);
