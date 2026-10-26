export default function LevelProgress({ percent, label }: { percent: number; label?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-mute"><span>{label ?? 'Campaign'}</span><span>{percent}%</span></div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Campaign completion" className="h-2 overflow-hidden rounded-full bg-edge/60">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
