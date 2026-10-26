export default function ChapterHeader({ n, title, difficulty, done, total = 20 }: { n: number; title: string; difficulty: string; done: number; total?: number }) {
  return (
    <div className="mb-3 mt-10 flex flex-wrap items-end justify-between gap-2 border-b border-edge/60 pb-2 first:mt-0">
      <div><p className="h-label">Chapter {n}</p><h2 className="font-display text-2xl font-bold">{title}</h2></div>
      <p className="text-sm text-mute">{difficulty} · {done}/{total} solved</p>
    </div>
  );
}
