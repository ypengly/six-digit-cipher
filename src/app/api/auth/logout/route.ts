import type { NextRequest } from 'next/server';
import { fail, json, sameOrigin } from '@/lib/api';
import { destroySession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail('Bad origin', 403);
  await destroySession();
  return json({ ok: true });
}
