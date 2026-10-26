import { json } from '@/lib/api';
import { ACHIEVEMENTS } from '@/data/achievements';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export async function GET() {
  const user = await getSessionUser();
  const owned = user ? await db.playerAchievement.findMany({ where: { userId: user.id }, select: { achievementId: true, unlockedAt: true } }) : [];
  return json({ ok: true, achievements: ACHIEVEMENTS.map(({ id, name, description }) => ({ id, name, description })), unlocked: owned });
}
