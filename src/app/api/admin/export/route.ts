import type { NextRequest } from 'next/server';
import { adminGuard } from '@/lib/admin';
import { db } from '@/lib/db';
import { rowToLevel } from '@/lib/levels';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const g = await adminGuard(req, false);
  if ('error' in g) return g.error;
  const rows = await db.level.findMany({ orderBy: { number: 'asc' } });
  return new Response(JSON.stringify(rows.map(rowToLevel), null, 2), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="levels-export.json"', 'Cache-Control': 'no-store' } });
}
