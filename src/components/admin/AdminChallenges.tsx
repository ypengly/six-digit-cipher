'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from './useAdminApi';

interface C { date: string; instanceId: string; seed: number; source: string; title: string; clues: string[]; answer: string }

export default function AdminChallenges() {
  const [rows, setRows] = useState<C[]>([]);
  const [msg, setMsg] = useState('');
  const load = useCallback(async () => { const r: any = await api('/api/admin/challenges'); if (r.ok) setRows(r.challenges); else setMsg(r.error); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await api('/api/admin/challenges', 'POST', { date: f.get('date'), title: f.get('title'), clues: String(f.get('clues')).split('\n').map((x) => x.trim()).filter(Boolean), answer: f.get('answer'), explanation: f.get('explanation') });
    setMsg(r.ok ? 'Saved' : r.error ?? 'Failed'); if (r.ok) load();
  };
  const I = 'mt-1 w-full rounded-lg border border-edge bg-bg p-2 text-sm';
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Daily challenges</h1>
      <p className="mt-1 text-sm text-mute">Each day gets a deterministic generated puzzle (verified to have exactly one solution). Add a manual one below to override a date.</p>
      {msg && <p role="status" className="mt-3 rounded-lg bg-panel p-2 text-sm">{msg}</p>}
      <form onSubmit={save} className="card mt-4 grid gap-3 p-4 md:grid-cols-2">
        <div><label htmlFor="d" className="text-sm">Date (UTC)</label><input id="d" name="date" required pattern="\d{4}-\d{2}-\d{2}" placeholder="2026-12-24" className={I} /></div>
        <div><label htmlFor="a" className="text-sm">Answer (six digits)</label><input id="a" name="answer" required pattern="\d{6}" maxLength={6} className={`${I} font-mono`} /></div>
        <div className="md:col-span-2"><label htmlFor="t" className="text-sm">Title</label><input id="t" name="title" required className={I} /></div>
        <div className="md:col-span-2"><label htmlFor="c" className="text-sm">Clues (one per line)</label><textarea id="c" name="clues" required rows={4} className={I} /></div>
        <div className="md:col-span-2"><label htmlFor="e" className="text-sm">Explanation</label><textarea id="e" name="explanation" required rows={2} className={I} /></div>
        <div><button className="btn-primary">Save challenge</button></div>
      </form>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Recent daily challenges</caption>
          <thead className="text-xs uppercase text-mute"><tr>{['Date', 'Source', 'Instance', 'Answer', 'Clues'].map((h) => <th scope="col" key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{rows.map((c) => <tr key={c.date} className="border-t border-edge/50"><td className="p-3 font-mono">{c.date}</td><td className="p-3">{c.source}</td><td className="p-3 font-mono text-xs">{c.instanceId}</td><td className="p-3 font-mono">{c.answer}</td><td className="p-3">{c.clues.length}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
