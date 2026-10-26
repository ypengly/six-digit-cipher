import 'server-only';
import { db } from './db';
import { generateDaily } from './daily';
import { jsonParse } from './utils';

export interface DailyRow { id: string; date: string; instanceId: string; seed: number; title: string; clues: string[]; answer: string; explanation: string; source: string }

/** Returns the stored challenge for a date, generating (deterministically) and persisting it on first request. */
export async function getOrCreateDaily(date: string): Promise<DailyRow> {
  let r = await db.dailyChallenge.findUnique({ where: { date } });
  if (!r) {
    const g = generateDaily(date, process.env.DAILY_SALT ?? '');
    try {
      r = await db.dailyChallenge.create({ data: { date, instanceId: g.instanceId, seed: g.seed, source: 'generated', title: g.title, cluesJson: JSON.stringify(g.clues), answer: g.answer, explanation: g.explanation } });
    } catch { r = await db.dailyChallenge.findUnique({ where: { date } }); } // lost a race with another request
  }
  if (!r) throw new Error('daily challenge unavailable');
  return { id: r.id, date: r.date, instanceId: r.instanceId, seed: r.seed, title: r.title, clues: jsonParse<string[]>(r.cluesJson, []), answer: r.answer, explanation: r.explanation, source: r.source };
}
