import { NextResponse, type NextRequest } from 'next/server';
import type { ZodType, ZodTypeDef } from 'zod';
import { rateLimit } from './rate-limit';

export const json = (data: unknown, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
export const fail = (error: string, status = 400, extra: Record<string, unknown> = {}) => json({ ok: false, error, ...extra }, status);

export function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

/** Parses and validates a JSON body. Never echoes the offending value back (could contain a guess). */
export async function parseBody<T>(req: NextRequest, schema: ZodType<T, ZodTypeDef, unknown>): Promise<{ data: T } | { error: NextResponse }> {
  let raw: unknown;
  try { raw = await req.json(); } catch { return { error: fail('Invalid JSON', 400) }; }
  const r = schema.safeParse(raw);
  if (!r.success) return { error: fail(r.error.issues[0]?.message ?? 'Invalid input', 400) };
  return { data: r.data };
}

/** Same-origin check for state-changing requests (defence in depth on top of SameSite=Lax). */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients (tests, curl)
  try { return new URL(origin).host === req.headers.get('host'); } catch { return false; }
}

export function limited(req: NextRequest, scope: string, limit: number, windowMs: number, userId?: string) {
  const r = rateLimit(`${scope}:${userId ?? clientIp(req)}`, limit, windowMs);
  return r.allowed ? null : fail('Too many requests. Slow down.', 429, { retryAfterSec: r.retryAfterSec });
}
