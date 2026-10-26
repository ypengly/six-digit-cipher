import { json } from '@/lib/api';
import { listSummaries } from '@/lib/levels';

export const dynamic = 'force-dynamic';
export async function GET() {
  return json({ ok: true, levels: await listSummaries() });
}
