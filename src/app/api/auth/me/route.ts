import { json } from '@/lib/api';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export async function GET() {
  return json({ ok: true, user: await getSessionUser() });
}
