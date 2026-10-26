import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { db } from './db';

const COOKIE = 'sdc_session';
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32 || s.startsWith('replace-with')) throw new Error('AUTH_SECRET is missing or too short. Set a random value of 32+ characters in .env');
  return new TextEncoder().encode(s);
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
let dummy: string | undefined;
/** Real bcrypt hash used to equalise login timing when the account does not exist. */
export const dummyHash = () => (dummy ??= bcrypt.hashSync('not-a-real-password', 12));
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export interface SessionUser { id: string; email: string; displayName: string; role: 'PLAYER' | 'ADMIN' }

export async function createSession(userId: string) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime(`${MAX_AGE}s`).sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: MAX_AGE });
}
export async function destroySession() { (await cookies()).delete(COOKIE); }

/** Returns the signed-in user (re-read from the DB so role changes apply immediately), or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const u = await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, displayName: true, role: true } });
    return u ? { ...u, role: u.role === 'ADMIN' ? 'ADMIN' : 'PLAYER' } : null;
  } catch { return null; }
}
export async function requireAdmin(): Promise<SessionUser | null> {
  const u = await getSessionUser();
  return u && u.role === 'ADMIN' ? u : null;
}
