'use client';
export async function api<T = any>(url: string, method = 'GET', body?: unknown): Promise<T & { ok: boolean; error?: string; issues?: string[] }> {
  const r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  return r.json();
}
