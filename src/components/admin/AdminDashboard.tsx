'use client';
import { useEffect, useState } from 'react';
import { api } from './useAdminApi';

interface Row { number: number; title: string; status: string; submissions: number; correct: number; started: number; completed: number; completionRate: number | null; avgAttempts: number | null }

export default function AdminDashboard() {
  const [d, setD] = useState<{ players: number; totalSubmissions: number; levels: Row[] } | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/api/admin/stats').then((r) => (r.ok ? setD(r as never) : setErr(r.error ?? 'Failed'))); }, []);
  if (err) return <p role="alert" className="text-bad">{err}</p>;
  if (!d) return <p className="text-mute" role="status">Loading statistics…</p>;
  const done = d.levels.reduce((a, l) => a + l.completed, 0);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Campaign statistics</h1>
      <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[['Registered players', d.players], ['Code submissions', d.totalSubmissions], ['Level completions', done], ['Published levels', d.levels.filter((l) => l.status === 'published').length]].map(([k, v]) => <div key={String(k)} className="card p-4"><dt className="text-xs text-mute">{k}</dt><dd className="font-mono text-2xl">{v}</dd></div>)}
      </dl>
      <p className="mt-3 text-xs text-mute">Statistics cover signed-in players and recorded submissions. Guest progress lives in their browsers and is not counted.</p>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Per-level completion rates and average attempts</caption>
          <thead className="text-xs uppercase text-mute"><tr>{['#', 'Title', 'Status', 'Submissions', 'Started', 'Completed', 'Completion', 'Avg attempts'].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
          <tbody>{d.levels.map((l) => (
            <tr key={l.number} className="border-t border-edge/50"><td className="p-3 font-mono">{l.number}</td><td className="p-3">{l.title}</td><td className="p-3">{l.status}</td><td className="p-3">{l.submissions}</td><td className="p-3">{l.started}</td><td className="p-3">{l.completed}</td><td className="p-3">{l.completionRate == null ? '-' : `${l.completionRate}%`}</td><td className="p-3">{l.avgAttempts ?? '-'}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
