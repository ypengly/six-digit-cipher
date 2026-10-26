import type { NextRequest } from 'next/server';
import { adminGuard } from '@/lib/admin';
import { fail, json, parseBody } from '@/lib/api';
import { db } from '@/lib/db';
import { levelInputSchema } from '@/lib/validation';
import { validateLevelStructure } from '@/lib/puzzle-validation';
import { levelToRow, rowToLevel } from '@/lib/levels';

export const dynamic = 'force-dynamic';
type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const g = await adminGuard(req, false);
  if ('error' in g) return g.error;
  const row = await db.level.findUnique({ where: { key: (await ctx.params).id } });
  if (!row) return fail('Not found', 404);
  const history = await db.puzzleEdit.findMany({ where: { levelId: row.id }, orderBy: { createdAt: 'desc' }, take: 25, select: { id: true, action: true, createdAt: true, editor: { select: { displayName: true } } } });
  return json({ ok: true, level: rowToLevel(row), history });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const key = (await ctx.params).id;
  const row = await db.level.findUnique({ where: { key } });
  if (!row) return fail('Not found', 404);
  const p = await parseBody(req, levelInputSchema);
  if ('error' in p) return p.error;
  const l = p.data;
  if (l.status === 'published') {
    const rep = validateLevelStructure(l);
    if (!rep.ok) return fail('Level failed validation', 422, { issues: rep.issues });
  }
  if (l.number !== row.number && (await db.level.findUnique({ where: { number: l.number }, select: { id: true } }))) return fail('That level number is taken', 409);
  const action = row.status !== 'published' && l.status === 'published' ? 'publish' : l.status === 'archived' && row.status !== 'archived' ? 'archive' : 'update';
  await db.puzzleEdit.create({ data: { levelId: row.id, editorId: g.user.id, action, snapshot: JSON.stringify(rowToLevel(row)) } });
  const data = levelToRow({ ...l, id: key, altAnswers: l.altAnswers ?? [] } as never);
  await db.level.update({ where: { key }, data: { ...data, version: row.version + 1 } });
  return json({ ok: true, version: row.version + 1 });
}

/** DELETE archives instead of destroying: player progress and history stay intact. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const key = (await ctx.params).id;
  const row = await db.level.findUnique({ where: { key } });
  if (!row) return fail('Not found', 404);
  await db.puzzleEdit.create({ data: { levelId: row.id, editorId: g.user.id, action: 'archive', snapshot: JSON.stringify(rowToLevel(row)) } });
  await db.level.update({ where: { key }, data: { status: 'archived', version: row.version + 1 } });
  return json({ ok: true });
}
