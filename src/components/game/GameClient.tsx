'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Lock, Pause, Play, RotateCcw, Send, X } from 'lucide-react';
import type { PublicLevel } from '@/types/level';
import type { SubmitResult } from '@/types/game';
import type { LevelProgress } from '@/types/progress';
import { useGame, emptyProgress } from '@/store/game-store';
import { isUnlocked, campaignPercent } from '@/lib/progression';
import { evaluateAchievements } from '@/data/achievements';
import { formatTime } from '@/lib/utils';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useSound } from '@/hooks/useSound';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import PageContainer from '@/components/layout/PageContainer';
import CodeDisplay from './CodeDisplay';
import NumericKeypad from './NumericKeypad';
import PuzzlePanel from './PuzzlePanel';
import HintPanel from './HintPanel';
import LevelProgress_ from './LevelProgress';
import AttemptFeedback from './AttemptFeedback';
import VictoryDialog from './VictoryDialog';

type Ok = Extract<SubmitResult, { correct: true }>;
interface Props { level: PublicLevel; mode: 'campaign' | 'daily'; dailyDate?: string }
const post = (url: string, body: unknown) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export default function GameClient({ level, mode, dailyDate }: Props) {
  const n = level.number;
  const daily = mode === 'daily';
  const hydrated = useGame((s) => s.hydrated);
  const progress = useGame((s) => s.progress);
  const user = useGame((s) => s.user);
  const note = useGame((s) => s.notes[n] ?? '');
  const { setLevel, patchLevel, setNote, addDaily, addAchievements } = useGame.getState();
  const sound = useSound();

  const [code, setCode] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [localHints, setLocalHints] = useState(0); // daily mode keeps hints in memory only
  const [fb, setFb] = useState<{ kind: 'bad' | 'ok' | 'info' | null; message: string }>({ kind: null, message: '' });
  const [shake, setShake] = useState(false);
  const [result, setResult] = useState<Ok | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const locked = useRef(false);

  const prog = daily ? emptyProgress : progress[n] ?? emptyProgress;
  const hintsUsed = daily ? localHints : prog.hintsUsed;
  const attempts = daily ? sessionAttempts : prog.attempts;
  const unlocked = daily || !hydrated || isUnlocked(n, progress);
  const solved = !!result;

  // Timer: counts only while the tab is visible, the game isn't paused and the level isn't solved.
  useEffect(() => {
    if (paused || solved || !unlocked) return;
    const t = setInterval(() => { if (document.visibilityState === 'visible') setElapsed((e) => e + 1); }, 1000);
    return () => clearInterval(t);
  }, [paused, solved, unlocked]);

  // After a refresh, re-fetch the text of hints already paid for (this does not change the hint count).
  useEffect(() => {
    if (daily || !hydrated || hintsUsed === 0 || hints.length > 0) return;
    (async () => {
      const got: string[] = [];
      for (let i = 0; i < hintsUsed; i++) { const r = await post('/api/hints', { levelNumber: n, index: i }); const d = await r.json(); if (d.ok) got.push(d.hint); else break; }
      setHints(got);
    })();
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const addDigit = useCallback((d: string) => { if (locked.current) return; setCode((c) => (c.length < 6 ? c + d : c)); sound('key'); setFb({ kind: null, message: '' }); }, [sound]);
  const del = useCallback(() => { if (!locked.current) setCode((c) => c.slice(0, -1)); }, []);
  const clear = useCallback(() => { if (!locked.current) setCode(''); }, []);

  const submit = useCallback(async () => {
    if (locked.current || busy || paused) return;
    if (code.length !== 6) { setFb({ kind: 'info', message: 'Enter all six digits first.' }); return; }
    locked.current = true; setBusy(true); // blocks accidental double submissions
    let ok = false;
    try {
      const body = daily ? { daily: dailyDate, code, elapsedSec: elapsed, hintsUsed: localHints } : { levelNumber: n, code, elapsedSec: elapsed, hintsUsed, attempts };
      const res = await post('/api/submit', body);
      const d = (await res.json()) as SubmitResult;
      if (!d.ok) { setFb({ kind: 'bad', message: d.error }); sound('bad'); return; }
      if (!d.correct) {
        setSessionAttempts((a) => a + 1);
        if (!daily && !user) patchLevel(n, { attempts: attempts + 1 });
        if (!daily && user && typeof d.attempts === 'number') patchLevel(n, { attempts: d.attempts });
        setFb({ kind: 'bad', message: d.message }); setShake(true); sound('bad'); setTimeout(() => { setShake(false); setCode(''); }, 450);
        return;
      }
      ok = true; sound('ok');
      let fresh = d.newAchievements;
      if (daily) {
        addDaily(dailyDate!);
        if (!user) { const st = useGame.getState(); const ids = evaluateAchievements(st.progress, { daily: st.dailySolved.length }); fresh = ids.filter((i) => !st.achievements.includes(i)); addAchievements(ids); }
      } else {
        const old = useGame.getState().progress[n];
        const merged: LevelProgress = { ...d.progress, stars: Math.max(old?.stars ?? 0, d.progress.stars), bestTimeSec: old?.bestTimeSec != null ? Math.min(old.bestTimeSec, d.progress.bestTimeSec ?? elapsed) : d.progress.bestTimeSec, score: Math.max(old?.score ?? 0, d.progress.score) };
        setLevel(n, merged);
        if (!user) { const st = useGame.getState(); const ids = evaluateAchievements(st.progress, { daily: st.dailySolved.length }); fresh = ids.filter((i) => !st.achievements.includes(i)); addAchievements(ids); }
        if (d.newlyUnlocked) sound('unlock');
      }
      setResult({ ...d, newAchievements: fresh }); setShowResult(true);
    } catch { setFb({ kind: 'bad', message: 'Network error. Try again.' }); }
    finally { setBusy(false); if (!ok) locked.current = false; }
  }, [busy, paused, code, daily, dailyDate, elapsed, localHints, n, hintsUsed, attempts, user, sound, patchLevel, setLevel, addDaily, addAchievements]);

  useKeyboardControls({ onDigit: addDigit, onDelete: del, onClear: clear, onSubmit: submit, enabled: unlocked && !paused && !showResult });

  const reveal = async () => {
    if (daily) { setFb({ kind: 'info', message: 'Daily challenges have no stored hints. Re-read the clues!' }); return; }
    setBusy(true);
    try {
      const r = await post('/api/hints', { levelNumber: n, index: hintsUsed });
      const d = await r.json();
      if (d.ok) { setHints((h) => [...h, d.hint]); patchLevel(n, { hintsUsed: hintsUsed + 1 }); }
      else setFb({ kind: 'bad', message: d.error ?? 'Could not load hint' });
    } finally { setBusy(false); }
  };

  const resetPuzzle = () => { setCode(''); setElapsed(0); setFb({ kind: null, message: '' }); };
  const replay = () => { setResult(null); setShowResult(false); setCode(''); setElapsed(0); setHints([]); locked.current = false; setFb({ kind: null, message: '' }); };

  if (!unlocked) {
    return (
      <PageContainer narrow>
        <div className="card-glow p-8 text-center">
          <Lock className="mx-auto text-accent2" size={40} aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold">Level {n} is locked</h1>
          <p className="mt-2 text-mute">Solve Level {n - 1} to open this vault door.</p>
          <Link href={`/play/${Math.max(1, n - 1)}`} className="btn-primary mt-6">Go to Level {Math.max(1, n - 1)}</Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="chip !text-accent !border-accent/40">{daily ? 'Daily Challenge' : `Level ${n} · ${level.chapterTitle}`}</span>
        <DifficultyBadge level={level.difficulty} />
        <Link href="/levels" className="btn-ghost ml-auto !py-1.5 text-xs"><X size={14} aria-hidden /> Exit</Link>
      </div>
      {!daily && <LevelProgress_ percent={campaignPercent(progress)} />}
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{level.title}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="card relative p-5 lg:col-span-3">
          {paused ? (
            <div className="grid min-h-[16rem] place-items-center text-center"><div><p className="font-display text-2xl">Paused</p><p className="text-sm text-mute">Clues are hidden while the clock is stopped.</p><button type="button" className="btn-primary mt-4" onClick={() => setPaused(false)}><Play size={16} aria-hidden /> Resume</button></div></div>
          ) : <PuzzlePanel level={level} />}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="card-glow space-y-4 p-5">
            <CodeDisplay value={code} shake={shake} state={solved ? 'ok' : fb.kind === 'bad' && shake ? 'bad' : 'idle'} />
            <AttemptFeedback kind={fb.kind} message={fb.message} />
            <NumericKeypad onDigit={addDigit} onDelete={del} onClear={clear} disabled={busy || solved || paused} />
            <button type="button" className="btn-primary w-full !py-3" onClick={submit} disabled={busy || solved || paused || code.length !== 6}><Send size={16} aria-hidden /> Submit code</button>
            <div className="flex items-center justify-between text-sm text-mute">
              <span>Attempts: <b className="font-mono text-ink">{attempts}</b></span>
              <span aria-label="Elapsed time">Time: <b className="font-mono text-ink">{formatTime(elapsed)}</b> <span className="text-xs">(target {formatTime(level.estSeconds)})</span></span>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost flex-1" onClick={() => setPaused((p) => !p)} disabled={solved}>{paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}{paused ? 'Resume' : 'Pause'}</button>
              <button type="button" className="btn-ghost flex-1" onClick={resetPuzzle} disabled={solved}><RotateCcw size={16} aria-hidden /> Reset</button>
            </div>
            {solved && <button type="button" className="btn-violet w-full" onClick={() => setShowResult(true)}>View results</button>}
          </div>
          {!daily && <HintPanel hints={hints} used={hintsUsed} onReveal={reveal} busy={busy || solved} hintCount={level.hintCount} />}
          <section className="card p-4" aria-label="Notes">
            <label htmlFor="notes" className="h-label">Notes</label>
            <textarea id="notes" value={note} onChange={(e) => setNote(n, e.target.value)} rows={4} placeholder="Jot down deductions..."
              className="mt-2 w-full rounded-lg border border-edge bg-bg p-3 text-sm text-ink placeholder:text-mute" />
          </section>
          <p className="text-center text-xs text-mute">Keyboard: 0-9 type · Backspace delete · Enter submit · Esc clear</p>
        </div>
      </div>
      <VictoryDialog open={showResult} result={result} code={code} levelNumber={daily ? null : n} onReplay={replay} onClose={() => setShowResult(false)} />
    </PageContainer>
  );
}
