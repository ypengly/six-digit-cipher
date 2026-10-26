import type { NextRequest } from 'next/server';
import { fail, json, limited, parseBody, sameOrigin } from '@/lib/api';
import { registerSchema } from '@/lib/validation';
import { createSession, hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail('Bad origin', 403);
  const lim = limited(req, 'register', 10, 3_600_000);
  if (lim) return lim;
  const p = await parseBody(req, registerSchema);
  if ('error' in p) return p.error;
  const exists = await db.user.findUnique({ where: { email: p.data.email }, select: { id: true } });
  if (exists) return fail('That email is already registered', 409);
  const user = await db.user.create({ data: { email: p.data.email, displayName: p.data.displayName, passwordHash: await hashPassword(p.data.password), role: 'PLAYER' } });
  await createSession(user.id);
  return json({ ok: true, user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } });
}
