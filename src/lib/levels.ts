import 'server-only';
import { db } from './db';
import { jsonParse } from './utils';
import type { FullLevel, LevelSummary, Clue, Visual, Difficulty, LevelStatus } from '@/types/level';
import type { Level } from '@prisma/client';

export function rowToLevel(r: Level): FullLevel {
  return {
    id: r.key, number: r.number, chapter: r.chapter, chapterTitle: r.chapterTitle, title: r.title,
    difficulty: r.difficulty as Difficulty, category: r.category, story: r.story, instructions: r.instructions,
    clues: jsonParse<Clue[]>(r.cluesJson, []), visuals: jsonParse<Visual[]>(r.visualsJson, []),
    answer: r.answer, explanation: r.explanation, steps: jsonParse<string[]>(r.stepsJson, []),
    hints: jsonParse<string[]>(r.hintsJson, []), estSeconds: r.estSeconds,
    skills: jsonParse<string[]>(r.skillsJson, []), tags: jsonParse<string[]>(r.tagsJson, []),
    tests: jsonParse(r.testsJson, []), altAnswers: jsonParse<string[]>(r.altAnswersJson, []),
    status: r.status as LevelStatus, version: r.version,
  };
}

export async function getPublishedLevel(number: number): Promise<FullLevel | null> {
  const r = await db.level.findFirst({ where: { number, status: 'published' } });
  return r ? rowToLevel(r) : null;
}

export async function listSummaries(): Promise<LevelSummary[]> {
  const rows = await db.level.findMany({ where: { status: 'published' }, orderBy: { number: 'asc' }, select: { number: true, chapter: true, title: true, difficulty: true, category: true, estSeconds: true } });
  return rows.map((r) => ({ ...r, difficulty: r.difficulty as Difficulty }));
}

export function levelToRow(l: Omit<FullLevel, 'id'> & { id: string }) {
  return {
    key: l.id, number: l.number, chapter: l.chapter, chapterTitle: l.chapterTitle, title: l.title, difficulty: l.difficulty,
    category: l.category, story: l.story, instructions: l.instructions, cluesJson: JSON.stringify(l.clues),
    visualsJson: JSON.stringify(l.visuals ?? []), answer: l.answer, explanation: l.explanation, stepsJson: JSON.stringify(l.steps),
    hintsJson: JSON.stringify(l.hints), estSeconds: l.estSeconds, skillsJson: JSON.stringify(l.skills ?? []),
    tagsJson: JSON.stringify(l.tags ?? []), testsJson: JSON.stringify(l.tests ?? []), altAnswersJson: JSON.stringify(l.altAnswers ?? []),
    status: l.status, version: l.version,
  };
}
