'use client';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Unlock } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Stars from '@/components/ui/Stars';
import { achievementById } from '@/data/achievements';
import { formatTime } from '@/lib/utils';
import type { SubmitResult } from '@/types/game';

type Ok = Extract<SubmitResult, { correct: true }>;
interface Props { open: boolean; result: Ok | null; code: string; levelNumber: number | null; onReplay: () => void; onClose: () => void }

export default function VictoryDialog({ open, result, code, levelNumber, onReplay, onClose }: Props) {
  if (!result) return null;
  const next = levelNumber && levelNumber < 100 ? levelNumber + 1 : null;
  return (
    <Modal open={open} onClose={onClose} title="Level solved">
      <p className="h-label">Vault unlocked</p>
      <h2 className="mt-1 font-display text-3xl font-bold">Code accepted</h2>
      <p className="mt-2 font-mono text-3xl tracking-[0.3em] text-ok" aria-label={`Correct code ${code.split('').join(' ')}`}>{code}</p>
      <div className="mt-4 flex items-center gap-3"><Stars n={result.stars} size={26} /><span className="text-sm text-mute">{result.score} points</span></div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        {[['Attempts', result.attempts], ['Time', formatTime(result.elapsedSec)], ['Hints', result.hintsUsed]].map(([k, v]) => (
          <div key={String(k)} className="rounded-lg border border-edge bg-bg/60 p-2"><dt className="text-xs text-mute">{k}</dt><dd className="font-mono text-lg">{v}</dd></div>
        ))}
      </dl>
      <h3 className="h-label mt-5">How it works</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink/90">{result.explanation}</p>
      {result.newlyUnlocked && <p className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 p-2 text-sm text-accent"><Unlock size={16} aria-hidden /> Level {result.newlyUnlocked} unlocked</p>}
      {result.newAchievements.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">{result.newAchievements.map((id) => <li key={id} className="rounded-lg bg-accent2/10 p-2 text-accent2">Achievement: {achievementById(id)?.name ?? id}</li>)}</ul>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="btn-ghost" onClick={onReplay}><RotateCcw size={16} aria-hidden /> Replay</button>
        {next ? <Link href={`/play/${next}`} className="btn-primary ml-auto">Next level <ArrowRight size={16} aria-hidden /></Link>
          : <Link href="/levels" className="btn-primary ml-auto">All levels</Link>}
      </div>
    </Modal>
  );
}
