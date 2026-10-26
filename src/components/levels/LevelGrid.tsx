'use client';
import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/store/game-store';
import { isUnlocked } from '@/lib/progression';
import type { LevelSummary } from '@/types/level';
import ChapterHeader from './ChapterHeader';
import LevelCard from './LevelCard';

const DIFFS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
const STATES = ['All', 'Unlocked', 'Completed', 'Locked'];
const CH = [['Initiation', 'Beginner to Intermediate'], ['The Analyst', 'Intermediate'], ['The Deceiver', 'Advanced'], ['The Mind Labyrinth', 'Expert'], ['The Final Cipher', 'Master']];

export default function LevelGrid({ levels }: { levels: LevelSummary[] }) {
  const progress = useGame((s) => s.progress);
  const hydrated = useGame((s) => s.hydrated);
  const [diff, setDiff] = useState('All');
  const [state, setState] = useState('All');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(hydrated), [hydrated]);

  const shown = useMemo(() => levels.filter((l) => {
    const done = !!progress[l.number]?.completed, open = isUnlocked(l.number, progress);
    if (diff !== 'All' && l.difficulty !== diff) return false;
    if (state === 'Completed') return done;
    if (state === 'Unlocked') return open && !done;
    if (state === 'Locked') return !open;
    return true;
  }), [levels, progress, diff, state]);

  const pill = (active: boolean) => `rounded-full border px-3 py-1 text-xs ${active ? 'border-accent bg-accent/15 text-accent' : 'border-edge text-mute hover:text-ink'}`;
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-6" role="group" aria-label="Filters">
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-mute">Difficulty</span>{DIFFS.map((d) => <button key={d} type="button" aria-pressed={diff === d} onClick={() => setDiff(d)} className={pill(diff === d)}>{d}</button>)}</div>
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-mute">Status</span>{STATES.map((d) => <button key={d} type="button" aria-pressed={state === d} onClick={() => setState(d)} className={pill(state === d)}>{d}</button>)}</div>
      </div>
      {shown.length === 0 && <p className="card p-6 text-center text-mute">No levels match these filters.</p>}
      {CH.map(([title, d], i) => {
        const inCh = shown.filter((l) => l.chapter === i + 1);
        if (!inCh.length) return null;
        const done = levels.filter((l) => l.chapter === i + 1 && progress[l.number]?.completed).length;
        return (
          <section key={title} aria-label={`Chapter ${i + 1}`}>
            <ChapterHeader n={i + 1} title={title} difficulty={d} done={done} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {inCh.map((l) => <LevelCard key={l.number} level={l} progress={ready ? progress[l.number] : undefined} unlocked={ready ? isUnlocked(l.number, progress) : l.number === 1} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
