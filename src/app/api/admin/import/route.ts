import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { adminGuard } from '@/lib/admin';
import { fail, json } from '@/lib/api';
import { db } from '@/lib/db';
import { levelInputSchema } from '@/lib/validation';
import { validateLevelStructure } from '@/lib/puzzle-validation';
import { levelToRow } from '@/lib/levels';

const body = z.object({ levels: z.array(z.unknown()).min(1).max(500) });

/** All-or-nothing import: if any level is invalid, nothing is written. */
export async function POST(req: NextRequest) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail('Expected { levels: [...] }', 400);
  const issues: string[] = [];
  const valid: z.infer<typeof levelInputSchema>[] = [];
  parsed.data.levels.forEach((raw, i) => {
    const r = levelInputSchema.safeParse(raw);
    if (!r.success) { issues.push(`#${i + 1}: ${r.error.issues[0]?.path.join('.')}: ${r.error.issues[0]?.message}`); return; }
    const rep = validateLevelStructure(r.data);
    if (!rep.ok && r.data.status === 'published') issues.push(`#${i + 1} (${r.data.title}): ${rep.issues.join('; ')}`);
    valid.push(r.data);
  });
  if (issues.length) return fail('Import rejected', 422, { issues });
  let created = 0, updated = 0;
  for (const l of valid) {
    const key = l.id ?? `L${String(l.number).padStart(3, '0')}`;
    const data = levelToRow({ ...l, id: key, altAnswers: l.altAnswers ?? [] } as never);
    const existing = await db.level.findUnique({ where: { key } });
    const row = existing ? await db.level.update({ where: { key }, data: { ...data, version: existing.version + 1 } }) : await db.level.create({ data });
    existing ? updated++ : created++;
    await db.puzzleEdit.create({ data: { levelId: row.id, editorId: g.user.id, action: 'import', snapshot: JSON.stringify({ title: l.title }) } });
  }
  return json({ ok: true, created, updated });
}
