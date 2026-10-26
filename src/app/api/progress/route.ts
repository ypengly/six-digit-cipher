import type { NextRequest } from 'next/server';
import { fail, json, sameOrigin } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';
import { dailySolvedCount, loadProgressMap } from '@/lib/server-progress';
import { evaluateAchievements } from '@/data/achievements';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return json({ ok: true, user: null });
  const progress = await loadProgressMap(user.id);
  return json({ ok: true, user, progress, achievements: evaluateAchievements(progress, { daily: await dailySolvedCount(user.id) }) });
}

/** Reset the signed-in player's campaign (the UI asks for confirmation first). */
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return fail('Bad origin', 403);
  const user = await getSessionUser();
  if (!user) return fail('Sign in to reset server progress', 401);
  await db.playerProgress.deleteMany({ where: { userId: user.id } });
  await db.playerAchievement.deleteMany({ where: { userId: user.id } });
  return json({ ok: true });
}
