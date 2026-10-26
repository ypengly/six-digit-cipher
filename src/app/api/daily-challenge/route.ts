import { json } from '@/lib/api';
import { getOrCreateDaily } from '@/lib/daily-server';
import { todayUTC } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export async function GET() {
  const d = await getOrCreateDaily(todayUTC());
  return json({ ok: true, daily: { date: d.date, instanceId: d.instanceId, title: d.title, clues: d.clues } }); // no answer
}
