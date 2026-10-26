'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useGame } from '@/store/game-store';

export default function ConfirmReset({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const user = useGame((s) => s.user);
  const go = async () => {
    setBusy(true);
    try {
      if (user) await fetch('/api/progress', { method: 'DELETE' });
      useGame.getState().resetGuest();
      if (user) useGame.getState().replaceProgress({});
      onClose(); setText('');
    } finally { setBusy(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Reset campaign">
      <h2 className="font-display text-2xl font-bold">Reset all progress?</h2>
      <p className="mt-2 text-sm text-mute">This permanently erases completed levels, stars, hints, notes and achievements{user ? ' from your account and this browser' : ' from this browser'}. It cannot be undone.</p>
      <label className="mt-4 block text-sm" htmlFor="rst">Type <b>RESET</b> to confirm</label>
      <input id="rst" value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" className="mt-1 w-full rounded-lg border border-edge bg-bg p-2 font-mono" />
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
        <button type="button" className="btn bg-bad text-white" disabled={text !== 'RESET' || busy} onClick={go}>Erase progress</button>
      </div>
    </Modal>
  );
}
