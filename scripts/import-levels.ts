// Usage: npm run levels:import -- path/to/levels.json
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { levelInputSchema } from '../src/lib/validation';
import { validateLevelStructure } from '../src/lib/puzzle-validation';

const file = process.argv[2];
if (!file) { console.error('Usage: npm run levels:import -- <file.json>'); process.exit(1); }
const db = new PrismaClient();

async function main() {
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  const list: unknown[] = Array.isArray(raw) ? raw : raw.levels;
  const problems: string[] = [];
  const ok = list.map((x, i) => {
    const r = levelInputSchema.safeParse(x);
    if (!r.success) { problems.push(`#${i + 1}: ${r.error.issues[0]?.path.join('.')}: ${r.error.issues[0]?.message}`); return null; }
    const rep = validateLevelStructure(r.data);
    if (!rep.ok && r.data.status === 'published') problems.push(`#${i + 1} ${r.data.title}: ${rep.issues.join('; ')}`);
    return r.data;
  });
  if (problems.length) { console.error('Import rejected:\n - ' + problems.join('\n - ')); process.exit(1); }
  for (const l of ok) {
    if (!l) continue;
    const key = l.id ?? `L${String(l.number).padStart(3, '0')}`;
    const data = {
      key, number: l.number, chapter: l.chapter, chapterTitle: l.chapterTitle, title: l.title, difficulty: l.difficulty, category: l.category,
      story: l.story, instructions: l.instructions, cluesJson: JSON.stringify(l.clues), visualsJson: JSON.stringify(l.visuals),
      answer: l.answer, explanation: l.explanation, stepsJson: JSON.stringify(l.steps), hintsJson: JSON.stringify(l.hints), estSeconds: l.estSeconds,
      skillsJson: JSON.stringify(l.skills), tagsJson: JSON.stringify(l.tags), testsJson: JSON.stringify(l.tests), altAnswersJson: JSON.stringify(l.altAnswers ?? []),
      status: l.status, version: l.version,
    };
    await db.level.upsert({ where: { key }, update: data, create: data });
  }
  console.log(`Imported ${ok.length} levels.`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
