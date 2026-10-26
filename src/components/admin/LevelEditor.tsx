'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './useAdminApi';
import PuzzlePanel from '@/components/game/PuzzlePanel';

const blank = {
  id: '', number: 101, chapter: 5, chapterTitle: 'The Final Cipher', title: '', difficulty: 'Master', category: '', story: '', instructions: 'Use every clue. Enter the six-digit code.',
  cluesText: '', visualsJson: '[]', answer: '', explanation: '', stepsText: '', hintsText: '', estSeconds: 300, status: 'draft', altAnswers: '', version: 1,
};
type F = typeof blank;

export default function LevelEditor({ levelKey }: { levelKey?: string }) {
  const router = useRouter();
  const [f, setF] = useState<F>(blank);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [history, setHistory] = useState<{ id: string; action: string; createdAt: string; editor: { displayName: string } | null }[]>([]);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!levelKey) return;
    api(`/api/admin/levels/${levelKey}`).then((r: any) => {
      if (!r.ok) { setMsg({ ok: false, text: r.error }); return; }
      const l = r.level; setHistory(r.history);
      setF({ id: l.id, number: l.number, chapter: l.chapter, chapterTitle: l.chapterTitle, title: l.title, difficulty: l.difficulty, category: l.category, story: l.story, instructions: l.instructions,
        cluesText: l.clues.map((c: any) => `${c.kind === 'decoy' ? '!' : ''}${c.text}`).join('\n'), visualsJson: JSON.stringify(l.visuals), answer: l.answer, explanation: l.explanation,
        stepsText: l.steps.join('\n'), hintsText: l.hints.join('\n'), estSeconds: l.estSeconds, status: l.status, altAnswers: (l.altAnswers ?? []).join(','), version: l.version });
    });
  }, [levelKey]);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
  const payload = () => {
    let visuals: unknown = [];
    try { visuals = JSON.parse(f.visualsJson || '[]'); } catch { throw new Error('Visuals must be valid JSON'); }
    return {
      id: f.id || undefined, number: f.number, chapter: f.chapter, chapterTitle: f.chapterTitle, title: f.title, difficulty: f.difficulty, category: f.category, story: f.story, instructions: f.instructions,
      clues: lines(f.cluesText).map((t, i) => ({ id: `c${i + 1}`, text: t.replace(/^!/, ''), kind: t.startsWith('!') ? 'decoy' : 'clue' })), visuals, answer: f.answer, explanation: f.explanation,
      steps: lines(f.stepsText), hints: lines(f.hintsText), estSeconds: f.estSeconds, skills: [f.category], tags: [f.category.toLowerCase()], status: f.status,
      altAnswers: f.altAnswers ? f.altAnswers.split(',').map((x) => x.trim()).filter(Boolean) : undefined, version: f.version,
      tests: f.answer ? [{ code: f.answer, correct: true }, { code: f.answer.slice(0, 5) + String((Number(f.answer[5]) + 1) % 10), correct: false }] : [],
    };
  };
  const run = async (kind: 'validate' | 'save') => {
    let p; try { p = payload(); } catch (e) { setMsg({ ok: false, text: (e as Error).message }); return; }
    if (kind === 'validate') {
      const r: any = await api('/api/admin/validate', 'POST', { level: p });
      setMsg({ ok: r.valid, text: r.valid ? `Valid. ${r.note}` : `Problems: ${(r.issues ?? [r.error]).join(' | ')}` });
    } else {
      const r: any = await api(levelKey ? `/api/admin/levels/${levelKey}` : '/api/admin/levels', levelKey ? 'PUT' : 'POST', p);
      if (r.ok) { setMsg({ ok: true, text: 'Saved' }); if (!levelKey) router.push('/admin/levels'); }
      else setMsg({ ok: false, text: `${r.error}${r.issues ? ': ' + r.issues.join(' | ') : ''}` });
    }
  };

  const L = 'block text-sm font-medium';
  const I = 'mt-1 w-full rounded-lg border border-edge bg-bg p-2 text-sm';
  let previewLevel: any = null; try { previewLevel = { story: f.story, instructions: f.instructions, visuals: JSON.parse(f.visualsJson || '[]'), clues: lines(f.cluesText).map((t, i) => ({ id: `p${i}`, text: t.replace(/^!/, ''), kind: t.startsWith('!') ? 'decoy' : 'clue' })) }; } catch { /* ignore */ }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{levelKey ? `Edit ${levelKey}` : 'New level'}</h1>
      <p className="mt-1 text-sm text-mute">One entry per line for clues, steps and hints. Start a clue line with <code>!</code> to mark it as a red herring (it must also start with [UNVERIFIED]). Answers are always six digits and stay on the server.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div><label className={L} htmlFor="title">Title</label><input id="title" className={I} value={f.title} onChange={set('title')} /></div>
        <div><label className={L} htmlFor="cat">Category</label><input id="cat" className={I} value={f.category} onChange={set('category')} /></div>
        <div><label className={L} htmlFor="num">Level number</label><input id="num" type="number" className={I} value={f.number} onChange={set('number')} /></div>
        <div><label className={L} htmlFor="ch">Chapter</label><input id="ch" type="number" className={I} value={f.chapter} onChange={set('chapter')} /></div>
        <div><label className={L} htmlFor="cht">Chapter title</label><input id="cht" className={I} value={f.chapterTitle} onChange={set('chapterTitle')} /></div>
        <div><label className={L} htmlFor="diff">Difficulty</label><select id="diff" className={I} value={f.difficulty} onChange={set('difficulty')}>{['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'].map((d) => <option key={d}>{d}</option>)}</select></div>
        <div><label className={L} htmlFor="ans">Answer (six digits)</label><input id="ans" inputMode="numeric" maxLength={6} className={`${I} font-mono`} value={f.answer} onChange={set('answer')} /></div>
        <div><label className={L} htmlFor="est">Target time (seconds)</label><input id="est" type="number" className={I} value={f.estSeconds} onChange={set('estSeconds')} /></div>
        <div><label className={L} htmlFor="alt">Alternative answers (comma separated, only if formally justified)</label><input id="alt" className={`${I} font-mono`} value={f.altAnswers} onChange={set('altAnswers')} /></div>
        <div><label className={L} htmlFor="st">Status</label><select id="st" className={I} value={f.status} onChange={set('status')}>{['draft', 'published', 'archived'].map((d) => <option key={d}>{d}</option>)}</select></div>
      </div>
      {[['story', 'Story', 'story', 3], ['instructions', 'Instructions', 'instructions', 2], ['cluesText', 'Clues (one per line)', 'cluesText', 6], ['visualsJson', 'Visual panels (JSON: [{"title":"","lines":[""]}])', 'visualsJson', 2], ['explanation', 'Explanation (must state the code)', 'explanation', 3], ['stepsText', 'Solution steps (one per line)', 'stepsText', 3], ['hintsText', 'Hints (one per line, up to 3, hint 3 is the near-solution)', 'hintsText', 4]].map(([id, label, key, rows]) => (
        <div key={id as string} className="mt-4"><label className={L} htmlFor={id as string}>{label as string}</label><textarea id={id as string} rows={rows as number} className={I} value={(f as any)[key as string]} onChange={set(key as keyof F)} /></div>
      ))}
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn-ghost" onClick={() => run('validate')}>Validate</button>
        <button type="button" className="btn-ghost" onClick={() => setPreview((p) => !p)}>{preview ? 'Hide' : 'Show'} player preview</button>
        <button type="button" className="btn-primary" onClick={() => run('save')}>Save</button>
      </div>
      {msg && <p role="status" className={`mt-3 rounded-lg p-2 text-sm ${msg.ok ? 'bg-ok/10 text-ok' : 'bg-bad/10 text-bad'}`}>{msg.text}</p>}
      {preview && previewLevel && <div className="card mt-5 p-5"><p className="h-label mb-3">Player preview</p><PuzzlePanel level={previewLevel} /></div>}
      {history.length > 0 && <div className="mt-8"><h2 className="font-display text-xl font-bold">Change history</h2><ul className="mt-2 space-y-1 text-sm text-mute">{history.map((h) => <li key={h.id}>{new Date(h.createdAt).toLocaleString()} · {h.action} · {h.editor?.displayName ?? 'system'}</li>)}</ul></div>}
    </div>
  );
}
