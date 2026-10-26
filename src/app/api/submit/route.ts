import type { NextRequest } from 'next/server';
import { fail, json, limited, parseBody, sameOrigin } from '@/lib/api';
import { submitSchema } from '@/lib/validation';
import { checkAnswer, wrongMessage } from '@/lib/game-engine';
import { computeScore, computeStars } from '@/lib/scoring';
import { isUnlocked } from '@/lib/progression';
import { getSessionUser } from '@/lib/auth';
import { getPublishedLevel } from '@/lib/levels';
import { db } from '@/lib/db';
import { awardAchievements, loadProgressMap, rowToProgress } from '@/lib/server-progress';
import { getOrCreateDaily } from '@/lib/daily-server';
import { todayUTC } from '@/lib/utils';
import type { LevelProgress } from '@/types/progress';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail('Bad origin', 403);
  const user = await getSessionUser();
  // Two windows: a burst limit and a slower sustained limit, to discourage brute-forcing six-digit codes.
  const burst = limited(req, 'submit-burst', 8, 20_000, user?.id);
  if (burst) return burst;
  const sustained = limited(req, 'submit-hour', 120, 3_600_000, user?.id);
  if (sustained) return sustained;

  const parsed = await parseBody(req, submitSchema);
  if ('error' in parsed) return parsed.error;
  const { levelNumber, daily, code, elapsedSec } = parsed.data;

  // ---------- Daily challenge ----------
  if (daily) {
    if (daily !== todayUTC()) return fail('Only today\'s challenge can be submitted', 400);
    const ch = await getOrCreateDaily(daily);
    const correct = checkAnswer(code, { answer: ch.answer });
    await db.levelAttempt.create({ data: { userId: user?.id, dailyId: ch.id, correct, elapsedSec } });
    if (!correct) return json({ ok: true, correct: false, message: wrongMessage(Math.floor(Math.random() * 4)) });
    const hints = user ? 0 : parsed.data.hintsUsed;
    const stars = computeStars(hints, elapsedSec, 300);
    let newAchievements: string[] = [];
    if (user) newAchievements = await awardAchievements(user.id, await loadProgressMap(user.id));
    return json({ ok: true, correct: true, explanation: ch.explanation, steps: [], stars, score: computeScore(hints, 0, elapsedSec, 300), attempts: 1, hintsUsed: hints, elapsedSec, progress: { completed: true, stars, attempts: 1, hintsUsed: hints, bestTimeSec: elapsedSec, score: 0 }, newlyUnlocked: null, newAchievements });
  }

  // ---------- Campaign level ----------
  const level = await getPublishedLevel(levelNumber!);
  if (!level) return fail('Level not found', 404);
  const correct = checkAnswer(code, level);

  if (!user) {
    // Guest mode: progress lives in the browser, so hints/attempts are client-reported and NOT cheat-resistant.
    if (!correct) return json({ ok: true, correct: false, message: wrongMessage(parsed.data.attempts) });
    const attempts = parsed.data.attempts + 1, hints = parsed.data.hintsUsed;
    const stars = computeStars(hints, elapsedSec, level.estSeconds);
    const score = computeScore(hints, parsed.data.attempts, elapsedSec, level.estSeconds);
    const progress: LevelProgress = { completed: true, stars, attempts, hintsUsed: hints, bestTimeSec: elapsedSec, score };
    return json({ ok: true, correct: true, explanation: level.explanation, steps: level.steps, stars, score, attempts, hintsUsed: hints, elapsedSec, progress, newlyUnlocked: levelNumber! < 100 ? levelNumber! + 1 : null, newAchievements: [] });
  }

  // Signed-in player: the server is authoritative for unlocks, attempts and hints.
  const map = await loadProgressMap(user.id);
  if (!isUnlocked(level.number, map)) return fail('Level is locked', 403);
  const prev = map[level.number];
  const row = await db.level.findUnique({ where: { number: level.number }, select: { id: true } });
  if (!row) return fail('Level not found', 404);
  await db.levelAttempt.create({ data: { userId: user.id, levelId: row.id, correct, elapsedSec } });

  if (!correct) {
    const up = await db.playerProgress.upsert({
      where: { userId_levelId: { userId: user.id, levelId: row.id } },
      update: { attempts: { increment: 1 } },
      create: { userId: user.id, levelId: row.id, attempts: 1, status: 'unlocked' },
    });
    return json({ ok: true, correct: false, message: wrongMessage(up.attempts), attempts: up.attempts });
  }

  const wrongBefore = prev?.attempts ?? 0;
  const hintsUsed = prev?.hintsUsed ?? 0;
  const first = !prev?.completed;
  const stars = computeStars(hintsUsed, elapsedSec, level.estSeconds);
  const score = computeScore(hintsUsed, wrongBefore, elapsedSec, level.estSeconds);
  const bestStars = Math.max(prev?.stars ?? 0, stars);
  const best = prev?.bestTimeSec != null ? Math.min(prev.bestTimeSec, elapsedSec) : elapsedSec;
  const saved = await db.playerProgress.upsert({
    where: { userId_levelId: { userId: user.id, levelId: row.id } },
    update: { status: 'completed', stars: bestStars, bestTimeSec: best, score: Math.max(prev?.score ?? 0, score), attempts: { increment: 1 }, completedAt: first ? new Date() : undefined },
    create: { userId: user.id, levelId: row.id, status: 'completed', stars, bestTimeSec: elapsedSec, score, attempts: 1, completedAt: new Date() },
  });
  const progress = rowToProgress(saved);
  const full = { ...map, [level.number]: progress };
  const newAchievements = await awardAchievements(user.id, full);
  return json({ ok: true, correct: true, explanation: level.explanation, steps: level.steps, stars, score, attempts: saved.attempts, hintsUsed, elapsedSec, progress, newlyUnlocked: first && level.number < 100 ? level.number + 1 : null, newAchievements });
}
