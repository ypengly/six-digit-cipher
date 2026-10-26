import type { NextRequest } from 'next/server';
import { adminGuard } from '@/lib/admin';
import { json, parseBody } from '@/lib/api';
import { db } from '@/lib/db';
import { challengeSchema } from '@/lib/validation';
import { getOrCreateDaily } from '@/lib/daily-server';
import { jsonParse, todayUTC } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const g = await adminGuard(req, false);
  if ('error' in g) return g.error;
  await getOrCreateDaily(todayUTC());
  const rows = await db.dailyChallenge.findMany({ orderBy: { date: 'desc' }, take: 30 });
  return json({ ok: true, challenges: rows.map((r) => ({ date: r.date, instanceId: r.instanceId, seed: r.seed, source: r.source, title: r.title, clues: jsonParse<string[]>(r.cluesJson, []), answer: r.answer })) });
}

/** Admins can hand-author or override a day's challenge. */
export async function POST(req: NextRequest) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const p = await parseBody(req, challengeSchema);
  if ('error' in p) return p.error;
  const c = p.data;
  const data = { source: 'manual', title: c.title, cluesJson: JSON.stringify(c.clues), answer: c.answer, explanation: c.explanation, instanceId: `manual-${c.date}`, seed: 0 };
  await db.dailyChallenge.upsert({ where: { date: c.date }, update: data, create: { date: c.date, ...data } });
  return json({ ok: true });
}
