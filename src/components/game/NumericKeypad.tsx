import { Delete, Eraser } from 'lucide-react';

interface Props { onDigit: (d: string) => void; onDelete: () => void; onClear: () => void; disabled?: boolean }
const key = 'h-14 rounded-xl border border-edge bg-panel/80 font-mono text-xl font-semibold text-ink transition hover:border-accent hover:text-accent active:scale-95 disabled:opacity-40 touch-manipulation';

export default function NumericKeypad({ onDigit, onDelete, onClear, disabled }: Props) {
  return (
    <div role="group" aria-label="Numeric keypad" className="mx-auto grid max-w-xs grid-cols-3 gap-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} type="button" className={key} disabled={disabled} onClick={() => onDigit(d)} aria-label={`Digit ${d}`}>{d}</button>
      ))}
      <button type="button" className={key} disabled={disabled} onClick={onClear} aria-label="Clear code"><Eraser className="mx-auto" size={20} aria-hidden /></button>
      <button type="button" className={key} disabled={disabled} onClick={() => onDigit('0')} aria-label="Digit 0">0</button>
      <button type="button" className={key} disabled={disabled} onClick={onDelete} aria-label="Delete last digit"><Delete className="mx-auto" size={20} aria-hidden /></button>
    </div>
  );
}
