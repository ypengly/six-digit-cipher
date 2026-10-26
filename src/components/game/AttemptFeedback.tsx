import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AttemptFeedback({ kind, message }: { kind: 'bad' | 'ok' | 'info' | null; message: string }) {
  return (
    <div role="status" aria-live="assertive" className="min-h-[2.5rem] text-center text-sm">
      {kind && message && (
        <p className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${kind === 'bad' ? 'bg-bad/10 text-bad' : kind === 'ok' ? 'bg-ok/10 text-ok' : 'bg-panel text-mute'}`}>
          {kind === 'bad' ? <AlertTriangle size={16} aria-hidden /> : <CheckCircle2 size={16} aria-hidden />}{message}
        </p>
      )}
    </div>
  );
}
