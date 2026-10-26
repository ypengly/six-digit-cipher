'use client';
import { useCallback, useRef } from 'react';
import { useGame } from '@/store/game-store';

/** Tiny synthesised sound effects (Web Audio): no audio files to download, works offline, silent when disabled. */
export function useSound() {
  const enabled = useGame((s) => s.settings.sound);
  const ctx = useRef<AudioContext | null>(null);
  return useCallback((kind: 'key' | 'ok' | 'bad' | 'unlock') => {
    if (!enabled || typeof window === 'undefined') return;
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current ??= new AC();
      const c = ctx.current, now = c.currentTime;
      const notes = { key: [[660, 0.04]], ok: [[523, 0.1], [784, 0.16]], bad: [[180, 0.18]], unlock: [[392, 0.1], [523, 0.1], [784, 0.2]] }[kind];
      let t = now;
      for (const [f, d] of notes) {
        const o = c.createOscillator(), g = c.createGain();
        o.type = kind === 'bad' ? 'sawtooth' : 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.9;
      }
    } catch { /* audio is optional */ }
  }, [enabled]);
}
