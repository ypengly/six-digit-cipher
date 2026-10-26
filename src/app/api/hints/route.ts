import type { NextRequest } from 'next/server';
import { fail, json, limited, parseBody, sameOrigin } from '@/lib/api';
import { hintSchema } from '@/lib/validation';
import { getSessionUser } from '@/lib/auth';
import { getPublishedLevel } from '@/lib/levels';
import { loadProgressMap } from '@/lib/server-progress';
import { isUnlocked } from '@/lib/progression';
import { HINT_ALLOWANCE } from '@/lib/scoring';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail('Bad origin', 403);
  const user = await getSessionUser();
  const lim = limited(req, 'hint', 30, 60_000, user?.id);
  if (lim) return lim;
  const parsed = await parseBody(req, hintSchema);
  if ('error' in parsed) return parsed.error;
  const { levelNumber, index } = parsed.data;
  const level = await getPublishedLevel(levelNumber);
  if (!level || index >= level.hints.length || index >= HINT_ALLOWANCE) return fail('No such hint', 404);

  if (user) {
    const map = await loadProgressMap(user.id);
    if (!isUnlocked(levelNumber, map)) return fail('Level is locked', 403);
    const used = map[levelNumber]?.hintsUsed ?? 0;
    if (index > used) return fail('Reveal hints in order', 400); // cannot skip straight to hint 3
    const row = await db.level.findUnique({ where: { number: levelNumber }, select: { id: true } });
    if (row) await db.playerProgress.upsert({
      where: { userId_levelId: { userId: user.id, levelId: row.id } },
      update: { hintsUsed: Math.max(used, index + 1) },
      create: { userId: user.id, levelId: row.id, hintsUsed: index + 1 },
    });
  }
  return json({ ok: true, index, hint: level.hints[index], remaining: HINT_ALLOWANCE - (index + 1) });
}
