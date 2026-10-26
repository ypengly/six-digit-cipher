import type { NextRequest } from 'next/server';
import { adminGuard } from '@/lib/admin';
import { fail, json, parseBody } from '@/lib/api';
import { db } from '@/lib/db';
import { reorderSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const p = await parseBody(req, reorderSchema);
  if ('error' in p) return p.error;
  const keys = p.data.order;
  if (new Set(keys).size !== keys.length) return fail('Duplicate ids in order', 400);
  const rows = await db.level.findMany({ where: { key: { in: keys } }, select: { id: true, key: true } });
  if (rows.length !== keys.length) return fail('Unknown level id in order', 400);
  const byKey = new Map(rows.map((r) => [r.key, r.id]));
  // Two passes so the unique constraint on `number` is never violated mid-way.
  await db.$transaction([
    ...keys.map((k, i) => db.level.update({ where: { key: k }, data: { number: 100000 + i } })),
    ...keys.map((k, i) => db.level.update({ where: { key: k }, data: { number: i + 1 } })),
    ...keys.map((k) => db.puzzleEdit.create({ data: { levelId: byKey.get(k)!, editorId: g.user.id, action: 'reorder', snapshot: '{}' } })),
  ]);
  return json({ ok: true });
}
