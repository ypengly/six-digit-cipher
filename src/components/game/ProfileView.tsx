'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import { useGame } from '@/store/game-store';
import { campaignPercent, summarise } from '@/lib/progression';
import { ACHIEVEMENTS, evaluateAchievements } from '@/data/achievements';
import LevelProgress from './LevelProgress';
import AchievementList from '@/components/achievements/AchievementList';
import ConfirmReset from './ConfirmReset';

export default function ProfileView() {
  const progress = useGame((s) => s.progress);
  const user = useGame((s) => s.user);
  const stored = useGame((s) => s.achievements);
  const daily = useGame((s) => s.dailySolved.length);
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const s = summarise(progress);
  const ach = new Set([...stored, ...evaluateAchievements(progress, { daily })]).size;
  const stats = [['Completed levels', `${s.completedCount}/100`], ['Total stars', s.totalStars], ['Total attempts', s.totalAttempts], ['Hints used', s.totalHints], ['Best no-hint streak', s.bestStreak], ['Achievements', `${ach}/${ACHIEVEMENTS.length}`]];

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    useGame.getState().setUser(null); useGame.getState().replaceProgress({}); router.refresh();
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">{user ? user.displayName : 'Guest profile'}</h1>
          <p className="mt-1 text-sm text-mute">{user ? `Signed in as ${user.email}. Progress is saved to your account.` : 'Playing as a guest. Progress is saved in this browser only.'}</p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'ADMIN' && <Link href="/admin/dashboard" className="btn-ghost"><ShieldCheck size={16} aria-hidden /> Admin</Link>}
          {user ? <button type="button" className="btn-ghost" onClick={logout}><LogOut size={16} aria-hidden /> Sign out</button> : <Link href="/account" className="btn-primary">Sign in or register</Link>}
        </div>
      </header>
      <div className="mt-6 max-w-lg"><LevelProgress percent={campaignPercent(progress)} label="Campaign completion" /></div>
      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {stats.map(([k, v]) => <div key={String(k)} className="card p-4"><dt className="text-xs text-mute">{k}</dt><dd className="mt-1 font-mono text-2xl">{v}</dd></div>)}
      </dl>
      <h2 className="mb-3 mt-10 font-display text-2xl font-bold">Achievements</h2>
      <AchievementList />
      <div className="mt-10 border-t border-edge/60 pt-6">
        <button type="button" className="btn-ghost !text-bad" onClick={() => setConfirm(true)}><Trash2 size={16} aria-hidden /> Reset progress</button>
      </div>
      <ConfirmReset open={confirm} onClose={() => setConfirm(false)} />
    </div>
  );
}
