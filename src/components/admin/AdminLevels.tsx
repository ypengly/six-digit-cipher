'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Archive, Download, Plus, Upload } from 'lucide-react';
import { api } from './useAdminApi';

interface L { key: string; number: number; chapter: number; title: string; difficulty: string; status: string; version: number }

export default function AdminLevels() {
  const [levels, setLevels] = useState<L[]>([]);
  const [msg, setMsg] = useState('');
  const file = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => { const r = await api('/api/admin/levels'); if (r.ok) setLevels((r as never as { levels: L[] }).levels); else setMsg(r.error ?? 'Failed to load'); }, []);
  useEffect(() => { load(); }, [load]);

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= levels.length) return;
    const next = [...levels]; [next[i], next[j]] = [next[j], next[i]];
    const r = await api('/api/admin/levels/reorder', 'POST', { order: next.map((l) => l.key) });
    setMsg(r.ok ? 'Order saved' : r.error ?? 'Reorder failed'); load();
  };
  const archive = async (k: string) => { if (!confirm('Archive this level? Players will no longer see it. History is kept.')) return; const r = await api(`/api/admin/levels/${k}`, 'DELETE'); setMsg(r.ok ? 'Archived' : r.error ?? 'Failed'); load(); };
  const imp = async (f: File) => {
    try {
      const parsed = JSON.parse(await f.text());
      const r = await api('/api/admin/import', 'POST', { levels: Array.isArray(parsed) ? parsed : parsed.levels });
      setMsg(r.ok ? `Imported: ${(r as never as { created: number }).created} created, ${(r as never as { updated: number }).updated} updated` : `${r.error}: ${(r.issues ?? []).slice(0, 5).join(' | ')}`);
      load();
    } catch { setMsg('That file is not valid JSON'); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold">Levels</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Link href="/admin/levels/new" className="btn-primary"><Plus size={16} aria-hidden /> New level</Link>
          <a href="/api/admin/export" className="btn-ghost"><Download size={16} aria-hidden /> Export JSON</a>
          <button type="button" className="btn-ghost" onClick={() => file.current?.click()}><Upload size={16} aria-hidden /> Import JSON</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && imp(e.target.files[0])} aria-label="Import levels JSON file" />
        </div>
      </div>
      {msg && <p role="status" className="mt-3 rounded-lg bg-panel p-2 text-sm">{msg}</p>}
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">All levels, including drafts and archived</caption>
          <thead className="text-xs uppercase text-mute"><tr>{['#', 'Title', 'Chapter', 'Difficulty', 'Status', 'v', 'Actions'].map((h) => <th scope="col" key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{levels.map((l, i) => (
            <tr key={l.key} className="border-t border-edge/50">
              <td className="p-3 font-mono">{l.number}</td><td className="p-3"><Link className="text-accent underline" href={`/admin/levels/${l.key}`}>{l.title}</Link></td>
              <td className="p-3">{l.chapter}</td><td className="p-3">{l.difficulty}</td><td className="p-3"><span className="chip">{l.status}</span></td><td className="p-3">{l.version}</td>
              <td className="flex gap-1 p-3">
                <button type="button" className="btn-ghost !p-1.5" onClick={() => move(i, -1)} aria-label={`Move ${l.title} up`}><ArrowUp size={14} /></button>
                <button type="button" className="btn-ghost !p-1.5" onClick={() => move(i, 1)} aria-label={`Move ${l.title} down`}><ArrowDown size={14} /></button>
                {l.status !== 'archived' && <button type="button" className="btn-ghost !p-1.5" onClick={() => archive(l.key)} aria-label={`Archive ${l.title}`}><Archive size={14} /></button>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mute">Reordering renumbers every level (1..n in the order shown). Player progress follows level numbers, so reorder carefully on a live game.</p>
    </div>
  );
}
