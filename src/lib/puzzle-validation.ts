import { levelInputSchema } from './validation';

export interface LevelReport { ok: boolean; issues: string[] }

/** Structural validation of one level. Uniqueness of the answer is proven separately by
 *  scripts/validate-levels.mjs (exhaustive search) for authored campaign levels. */
export function validateLevelStructure(level: unknown): LevelReport {
  const parsed = levelInputSchema.safeParse(level);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues.map((i) => `${i.path.join('.') || 'level'}: ${i.message}`) };
  const l = parsed.data;
  const issues: string[] = [];
  const visible = [l.story, l.instructions, ...l.clues.map((c) => c.text), ...l.visuals.flatMap((v) => v.lines)].join('\n');
  if (visible.includes(l.answer)) issues.push('Answer string appears in player-visible text');
  const early = l.hints.slice(0, -1).join('\n');
  if (l.hints.length >= 2 && early.includes(l.answer)) issues.push('Answer appears in an early hint');
  if (l.hints.length < 3) issues.push('Fewer than 3 hints');
  if (!l.clues.some((c) => c.kind === 'clue')) issues.push('No genuine clue');
  for (const t of l.tests) {
    const should = t.code === l.answer || (l.altAnswers ?? []).includes(t.code);
    if (t.correct !== should) issues.push(`Test case ${t.code} expects ${t.correct} but answer check gives ${should}`);
  }
  if (!l.explanation.includes(l.answer)) issues.push('Explanation does not state the code');
  return { ok: issues.length === 0, issues };
}
