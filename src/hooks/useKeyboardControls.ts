'use client';
import { useEffect } from 'react';

interface Handlers { onDigit: (d: string) => void; onDelete: () => void; onClear: () => void; onSubmit: () => void; enabled: boolean }

/** Physical keyboard: 0-9 type, Backspace deletes, Enter submits, Escape clears. */
export function useKeyboardControls({ onDigit, onDelete, onClear, onSubmit, enabled }: Handlers) {
  useEffect(() => {
    if (!enabled) return;
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT')) return; // don't steal typing from the notes box
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) { onDigit(e.key); e.preventDefault(); }
      else if (e.key === 'Backspace') { onDelete(); e.preventDefault(); }
      else if (e.key === 'Escape') { onClear(); }
      else if (e.key === 'Enter' && !(t && t.tagName === 'BUTTON')) { onSubmit(); e.preventDefault(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onDigit, onDelete, onClear, onSubmit, enabled]);
}
