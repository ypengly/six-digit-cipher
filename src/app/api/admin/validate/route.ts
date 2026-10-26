import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { adminGuard } from '@/lib/admin';
import { fail, json } from '@/lib/api';
import { db } from '@/lib/db';
import { validateLevelStructure } from '@/lib/puzzle-validation';
import { rowToLevel } from '@/lib/levels';
import { checkAnswer } from '@/lib/game-engine';

const body = z.union([z.object({ key: z.string().min(1) }), z.object({ level: z.unknown() })]);

/** Structural validation plus the level's own test cases. Proving that clues pin down ONE answer is done
 *  for the authored campaign by `npm run validate` (exhaustive search); admin-created levels get the structural
 *  checks and test cases, and the report says so. */
export async function POST(req: NextRequest) {
  const g = await adminGuard(req, true);
  if ('error' in g) return g.error;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail('Provide { key } or { level }', 400);
  let level: unknown;
  if ('key' in parsed.data) {
    const row = await db.level.findUnique({ where: { key: parsed.data.key } });
    if (!row) return fail('Not found', 404);
    level = rowToLevel(row);
  } else level = parsed.data.level;
  const rep = validateLevelStructure(level);
  const extra: string[] = [];
  const l = level as { answer?: string; tests?: { code: string; correct: boolean }[] };
  if (rep.ok && l.answer) {
    for (const t of l.tests ?? []) if (checkAnswer(t.code, { answer: l.answer }) !== t.correct) extra.push(`Test ${t.code} failed`);
  }
  return json({ ok: true, valid: rep.ok && extra.length === 0, issues: [...rep.issues, ...extra], note: 'Answer uniqueness is not machine-proven for admin-edited levels; run `npm run validate` for authored campaign levels.' });
}
