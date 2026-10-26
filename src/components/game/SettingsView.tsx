'use client';
import { useState } from 'react';
import { useGame } from '@/store/game-store';
import { HINT_ALLOWANCE } from '@/lib/scoring';
import ConfirmReset from './ConfirmReset';

function Toggle({ id, label, hint, checked, onChange }: { id: string; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id}><span className="font-medium">{label}</span>{hint && <span className="block text-xs text-mute">{hint}</span>}</label>
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-6 w-11 cursor-pointer accent-[rgb(var(--accent))]" />
    </div>
  );
}

export default function SettingsView() {
  const st = useGame((s) => s.settings);
  const set = useGame.getState().setSettings;
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold">Settings</h1>
      <section className="card divide-y divide-edge/60 px-5" aria-label="Preferences">
        <Toggle id="snd" label="Sound effects" hint="Short synthesised tones. No downloads." checked={st.sound} onChange={(v) => set({ sound: v })} />
        <Toggle id="mus" label="Music" hint="Not included in this build." checked={false} onChange={() => undefined} />
        <Toggle id="ani" label="Animations" checked={st.animations} onChange={(v) => set({ animations: v })} />
        <Toggle id="red" label="Reduced motion" hint="Stops all movement. Also follows your system setting." checked={st.reducedMotion} onChange={(v) => set({ reducedMotion: v })} />
        <div className="flex items-center justify-between py-3">
          <label htmlFor="theme" className="font-medium">Theme</label>
          <select id="theme" value={st.theme} onChange={(e) => set({ theme: e.target.value as 'dark' | 'light' })} className="rounded-lg border border-edge bg-bg px-3 py-1.5">
            <option value="dark">Dark (default)</option><option value="light">Light</option>
          </select>
        </div>
      </section>

      <section className="card p-5" aria-labelledby="scoring">
        <h2 id="scoring" className="font-display text-xl font-bold">Scoring rules</h2>
        <ul className="mt-2 space-y-1 text-sm text-ink/90">
          <li><b>3 stars:</b> no hints and solved within the level&apos;s target time.</li>
          <li><b>2 stars:</b> some hints used (fewer than {HINT_ALLOWANCE}) or the target time exceeded.</li>
          <li><b>1 star:</b> all {HINT_ALLOWANCE} hints used.</li>
          <li><b>Points:</b> 1000 base, minus 150 per hint, 20 per wrong attempt, 1 per 3 seconds over target (minimum 100).</li>
          <li>Replaying never lowers a result. The best stars, time and score are kept.</li>
        </ul>
      </section>

      <section className="card p-5" aria-labelledby="keys">
        <h2 id="keys" className="font-display text-xl font-bold">Keyboard controls</h2>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
          {[['0 - 9', 'Type a digit'], ['Backspace', 'Delete last digit'], ['Enter', 'Submit the code'], ['Esc', 'Clear the code'], ['Tab', 'Move between controls']].map(([k, v]) => (<div key={k} className="contents"><dt><kbd className="rounded border border-edge bg-bg px-1.5 font-mono">{k}</kbd></dt><dd className="text-mute">{v}</dd></div>))}
        </dl>
      </section>

      <section id="privacy" className="card p-5" aria-labelledby="priv">
        <h2 id="priv" className="font-display text-xl font-bold">Privacy</h2>
        <p className="mt-2 text-sm text-mute">As a guest, your progress, notes and settings are stored only in this browser (local storage). Nothing is sent anywhere except the code you submit, which the server checks. If you create an account, your email, display name and progress are stored in this game&apos;s database, and passwords are stored hashed. Submitted guesses are not stored. There are no ads or trackers.</p>
      </section>

      <section className="card border-bad/40 p-5" aria-labelledby="danger">
        <h2 id="danger" className="font-display text-xl font-bold text-bad">Reset campaign</h2>
        <p className="mt-1 text-sm text-mute">Erase all progress and start from Level 1.</p>
        <button type="button" className="btn mt-3 bg-bad text-white" onClick={() => setConfirm(true)}>Reset campaign…</button>
      </section>
      <ConfirmReset open={confirm} onClose={() => setConfirm(false)} />
    </div>
  );
}
