import type { NextRequest } from 'next/server';
import { adminGuard } from '@/lib/admin';
import { json } from '@/lib/api';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const g = await adminGuard(req, false);
  if ('error' in g) return g.error;
  const [players, levels, attempts, solved, prog] = await Promise.all([
    db.user.count({ where: { role: 'PLAYER' } }),
    db.level.findMany({ orderBy: { number: 'asc' }, select: { id: true, number: true, title: true, status: true } }),
    db.levelAttempt.groupBy({ by: ['levelId'], where: { levelId: { not: null } }, _count: { _all: true } }),
    db.levelAttempt.groupBy({ by: ['levelId'], where: { levelId: { not: null }, correct: true }, _count: { _all: true } }),
    db.playerProgress.groupBy({ by: ['levelId'], _count: { _all: true }, _avg: { attempts: true } }),
  ]);
  const completed = await db.playerProgress.groupBy({ by: ['levelId'], where: { status: 'completed' }, _count: { _all: true } });
  const A = new Map(attempts.map((r) => [r.levelId, r._count._all]));
  const S = new Map(solved.map((r) => [r.levelId, r._count._all]));
  const P = new Map(prog.map((r) => [r.levelId, r]));
  const C = new Map(completed.map((r) => [r.levelId, r._count._all]));
  const rows = levels.map((l) => {
    const started = P.get(l.id)?._count._all ?? 0, done = C.get(l.id) ?? 0;
    return { number: l.number, title: l.title, status: l.status, submissions: A.get(l.id) ?? 0, correct: S.get(l.id) ?? 0, started, completed: done, completionRate: started ? Math.round((done / started) * 100) : null, avgAttempts: P.get(l.id)?._avg.attempts != null ? Math.round((P.get(l.id)!._avg.attempts as number) * 10) / 10 : null };
  });
  return json({ ok: true, players, totalSubmissions: attempts.reduce((a, r) => a + r._count._all, 0), levels: rows });
}
