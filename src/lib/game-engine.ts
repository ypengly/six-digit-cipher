import { timingSafeEqual } from 'node:crypto';
import type { FullLevel, PublicLevel } from '@/types/level';

export const CODE_LENGTH = 6;
const CODE_RE = /^\d{6}$/;

/** A code is ALWAYS a string. Never convert to a number: 004281 must stay 004281. */
export const isValidCode = (code: unknown): code is string => typeof code === 'string' && CODE_RE.test(code);

export function checkAnswer(submitted: string, level: Pick<FullLevel, 'answer' | 'altAnswers'>): boolean {
  if (!isValidCode(submitted)) return false;
  const candidates = [level.answer, ...(level.altAnswers ?? [])];
  let ok = false;
  for (const c of candidates) {
    const a = Buffer.from(submitted), b = Buffer.from(c);
    if (a.length === b.length && timingSafeEqual(a, b)) ok = true; // no early exit: constant work
  }
  return ok;
}

/** Strips every secret (answer, explanation, steps, hint text) from a level. */
export function toPublicLevel(l: FullLevel): PublicLevel {
  return {
    number: l.number, chapter: l.chapter, chapterTitle: l.chapterTitle, title: l.title, difficulty: l.difficulty,
    category: l.category, story: l.story, instructions: l.instructions, clues: l.clues, visuals: l.visuals,
    estSeconds: l.estSeconds, hintCount: l.hints.length,
  };
}

export const WRONG_MESSAGES = [
  'The lock stays shut. Re-read the clues.',
  'Not it. Check each pair against its clue.',
  'Access denied. One of your deductions is off.',
  'The vault does not recognise that code.',
];
export const wrongMessage = (attempt: number) => WRONG_MESSAGES[attempt % WRONG_MESSAGES.length];
