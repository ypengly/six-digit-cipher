import 'server-only';
import { db } from './db';
import { evaluateAchievements, ACHIEVEMENTS } from '@/data/achievements';
import type { ProgressMap, LevelProgress } from '@/types/progress';

export async function loadProgressMap(userId: string): Promise<ProgressMap> {
  const rows = await db.playerProgress.findMany({ where: { userId }, include: { level: { select: { number: true } } } });
  const map: ProgressMap = {};
  for (const r of rows) map[r.level.number] = rowToProgress(r);
  return map;
}
export const rowToProgress = (r: { status: string; stars: number; attempts: number; hintsUsed: number; bestTimeSec: number | null; score: number }): LevelProgress => ({
  completed: r.status === 'completed', stars: r.stars, attempts: r.attempts, hintsUsed: r.hintsUsed, bestTimeSec: r.bestTimeSec, score: r.score,
});

export async function dailySolvedCount(userId: string): Promise<number> {
  const rows = await db.levelAttempt.findMany({ where: { userId, correct: true, dailyId: { not: null } }, select: { dailyId: true }, distinct: ['dailyId'] });
  return rows.length;
}

/** Awards any newly earned achievements and returns their ids. */
export async function awardAchievements(userId: string, progress: ProgressMap): Promise<string[]> {
  const earned = evaluateAchievements(progress, { daily: await dailySolvedCount(userId) });
  const have = new Set((await db.playerAchievement.findMany({ where: { userId }, select: { achievementId: true } })).map((a) => a.achievementId));
  const fresh = earned.filter((id) => !have.has(id));
  if (fresh.length) {
    for (const id of fresh) {
      const def = ACHIEVEMENTS.find((a) => a.id === id)!;
      await db.achievement.upsert({ where: { id }, update: {}, create: { id, name: def.name, description: def.description } });
    }
    await db.playerAchievement.createMany({ data: fresh.map((achievementId) => ({ userId, achievementId })) });
  }
  return fresh;
}
