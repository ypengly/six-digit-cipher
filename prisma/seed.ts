import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ACHIEVEMENTS } from '../src/data/achievements';

const db = new PrismaClient();

async function main() {
  let count = 0;
  for (let c = 1; c <= 5; c++) {
    const levels = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'levels', `chapter-0${c}.json`), 'utf8')) as any[];
    for (const l of levels) {
      const data = {
        key: l.id, number: l.number, chapter: l.chapter, chapterTitle: l.chapterTitle, title: l.title, difficulty: l.difficulty,
        category: l.category, story: l.story, instructions: l.instructions, cluesJson: JSON.stringify(l.clues),
        visualsJson: JSON.stringify(l.visuals ?? []), answer: String(l.answer), explanation: l.explanation,
        stepsJson: JSON.stringify(l.steps), hintsJson: JSON.stringify(l.hints), estSeconds: l.estSeconds,
        skillsJson: JSON.stringify(l.skills ?? []), tagsJson: JSON.stringify(l.tags ?? []), testsJson: JSON.stringify(l.tests ?? []),
        status: l.status ?? 'published', version: l.version ?? 1,
      };
      // Seeding never overwrites levels an admin has since edited (their version is higher).
      const existing = await db.level.findUnique({ where: { key: l.id } });
      if (!existing) { await db.level.create({ data }); count++; }
    }
  }
  for (const a of ACHIEVEMENTS) await db.achievement.upsert({ where: { id: a.id }, update: { name: a.name, description: a.description }, create: { id: a.id, name: a.name, description: a.description } });
  console.log(`Seeded ${count} new levels (existing levels left untouched) and ${ACHIEVEMENTS.length} achievements.`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
