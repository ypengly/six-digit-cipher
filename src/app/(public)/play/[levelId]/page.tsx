import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import GameClient from '@/components/game/GameClient';
import { getPublishedLevel } from '@/lib/levels';
import { toPublicLevel } from '@/lib/game-engine';
import { getSessionUser } from '@/lib/auth';
import { loadProgressMap } from '@/lib/server-progress';
import { isUnlocked } from '@/lib/progression';
import { getOrCreateDaily } from '@/lib/daily-server';
import { todayUTC } from '@/lib/utils';
import type { PublicLevel } from '@/types/level';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Play' };

export default async function PlayPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;

  if (levelId === 'daily') {
    const d = await getOrCreateDaily(todayUTC());
    const level: PublicLevel = {
      number: 0, chapter: 0, chapterTitle: 'Daily Challenge', title: d.title, difficulty: 'Intermediate', category: 'Daily',
      story: `A fresh vault for ${d.date}. Everyone gets the same puzzle today. Find the one six-digit code that satisfies every clue.`,
      instructions: 'There are no hints for the daily challenge. Every clue is true.',
      clues: d.clues.map((text, i) => ({ id: `d${i}`, text, kind: 'clue' as const })), visuals: [], estSeconds: 300, hintCount: 0,
    };
    return <GameClient level={level} mode="daily" dailyDate={d.date} />;
  }

  const n = Number(levelId);
  if (!Number.isInteger(n) || n < 1 || n > 100) notFound();
  const user = await getSessionUser();
  if (user && !isUnlocked(n, await loadProgressMap(user.id))) redirect('/levels');
  const level = await getPublishedLevel(n);
  if (!level) notFound();
  return <GameClient level={toPublicLevel(level)} mode="campaign" />; // answer, steps and hints stay on the server
}
