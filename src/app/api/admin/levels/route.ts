import type { NextRequest } from 'next/server';
import { adminGuard } from '@/lib/admin';
import { fail, json, parseBody } from '@/lib/api';
import { db } from '@/lib/db';
import { levelInputSchema } from '@/lib/validation';
import { validateLevelStructure } from '@/lib/puzzle-validation';
import { levelToRow } from '@/lib/levels';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const g = await adminGuard(req, false);
  if ('error' in g) return g.error;
  const rows = await db.level.findMany({ orderBy: { number: 'asc' }, select: { key: true, number: true, chapter: true, title: true, difficulty: true, category: true, status: true, version: true, updatedAt: true } });
  return json({ ok: true, levels: rows });
}

export async function POST(req: NextRequest) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const p = await parseBody(req, levelInputSchema);
  if ('error' in p) return p.error;
  const l = p.data;
  if (l.status === 'published') {
    const rep = validateLevelStructure(l);
    if (!rep.ok) return fail('Level failed validation', 422, { issues: rep.issues });
  }
  const key = l.id ?? `L${String(l.number).padStart(3, '0')}`;
  if (await db.level.findFirst({ where: { OR: [{ key }, { number: l.number }] }, select: { id: true } })) return fail('A level with that id or number already exists', 409);
  const row = await db.level.create({ data: levelToRow({ ...l, id: key, altAnswers: l.altAnswers ?? [] } as never) });
  await db.puzzleEdit.create({ data: { levelId: row.id, editorId: g.user.id, action: 'create', snapshot: JSON.stringify({ title: l.title, number: l.number, status: l.status }) } });
  return json({ ok: true, key }, 201);
}
