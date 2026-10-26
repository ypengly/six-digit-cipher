import 'server-only';
import type { NextResponse, NextRequest } from 'next/server';
import { fail, limited, sameOrigin } from './api';
import { requireAdmin, type SessionUser } from './auth';

/** Every admin route calls this first. Authorisation happens on the server for every request. */
export async function adminGuard(req: NextRequest, mutation: boolean): Promise<{ user: SessionUser } | { error: NextResponse }> {
  if (mutation && !sameOrigin(req)) return { error: fail('Bad origin', 403) };
  const user = await requireAdmin();
  if (!user) return { error: fail('Admin access required', 403) };
  const lim = limited(req, 'admin', 120, 60_000, user.id);
  if (lim) return { error: lim };
  return { user };
}
