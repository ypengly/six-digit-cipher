import type { NextRequest } from 'next/server';
import { fail, json } from '@/lib/api';
import { getPublishedLevel } from '@/lib/levels';
import { toPublicLevel } from '@/lib/game-engine';
import { getSessionUser } from '@/lib/auth';
import { loadProgressMap } from '@/lib/server-progress';
import { isUnlocked } from '@/lib/progression';

export const dynamic = 'force-dynamic';
export async function GET(_req: NextRequest, ctx: { params: Promise<{ n: string }> }) {
  const n = Number((await ctx.params).n);
  if (!Number.isInteger(n) || n < 1) return fail('Level not found', 404);
  const user = await getSessionUser();
  if (user && !isUnlocked(n, await loadProgressMap(user.id))) return fail('Level is locked', 403);
  const level = await getPublishedLevel(n);
  if (!level) return fail('Level not found', 404);
  return json({ ok: true, level: toPublicLevel(level) }); // never includes the answer
}
