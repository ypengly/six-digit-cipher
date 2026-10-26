'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/store/game-store';

/** Shared by the player account page and the admin login page. */
export default function AuthForm({ adminOnly = false }: { adminOnly?: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setErr('');
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());
    try {
      const r = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!d.ok) { setErr(d.error ?? 'Something went wrong'); return; }
      if (adminOnly && d.user.role !== 'ADMIN') { await fetch('/api/auth/logout', { method: 'POST' }); setErr('This account is not an administrator.'); return; }
      useGame.getState().setUser(d.user);
      const p = await (await fetch('/api/progress', { cache: 'no-store' })).json();
      if (p.user) { useGame.getState().replaceProgress(p.progress ?? {}); useGame.getState().setAchievements(p.achievements ?? []); }
      router.push(adminOnly ? '/admin/dashboard' : '/levels'); router.refresh();
    } catch { setErr('Network error'); } finally { setBusy(false); }
  };

  const input = 'mt-1 w-full rounded-lg border border-edge bg-bg p-2.5';
  return (
    <div className="card-glow mx-auto max-w-md p-6">
      <h1 className="font-display text-3xl font-bold">{adminOnly ? 'Admin sign in' : mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      {!adminOnly && <p className="mt-1 text-sm text-mute">Optional. Accounts save progress on the server. You can always play as a guest.</p>}
      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        {mode === 'register' && <div><label htmlFor="displayName" className="text-sm">Display name</label><input id="displayName" name="displayName" required minLength={2} maxLength={30} autoComplete="nickname" className={input} /></div>}
        <div><label htmlFor="email" className="text-sm">Email</label><input id="email" name="email" type="email" required autoComplete="email" className={input} /></div>
        <div><label htmlFor="password" className="text-sm">Password {mode === 'register' && <span className="text-mute">(10+ characters)</span>}</label><input id="password" name="password" type="password" required minLength={mode === 'register' ? 10 : 1} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={input} /></div>
        {err && <p role="alert" className="rounded-lg bg-bad/10 p-2 text-sm text-bad">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      {!adminOnly && <button type="button" className="mt-4 text-sm text-accent underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>{mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}</button>}
    </div>
  );
}
