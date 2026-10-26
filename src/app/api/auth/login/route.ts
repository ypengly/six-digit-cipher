import type { NextRequest } from 'next/server';
import { fail, json, limited, parseBody, sameOrigin } from '@/lib/api';
import { loginSchema } from '@/lib/validation';
import { createSession, dummyHash, verifyPassword } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail('Bad origin', 403);
  const lim = limited(req, 'login', 10, 15 * 60_000);
  if (lim) return lim;
  const p = await parseBody(req, loginSchema);
  if ('error' in p) return p.error;
  const user = await db.user.findUnique({ where: { email: p.data.email } });
  const ok = await verifyPassword(p.data.password, user?.passwordHash ?? dummyHash());
  if (!user || !ok) return fail('Invalid email or password', 401);
  await createSession(user.id);
  return json({ ok: true, user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } });
}
