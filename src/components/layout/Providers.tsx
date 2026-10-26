'use client';
import { useEffect } from 'react';
import { useGame } from '@/store/game-store';
import { useBootstrap } from '@/hooks/useGameProgress';

export default function Providers({ children }: { children: React.ReactNode }) {
  const settings = useGame((s) => s.settings);
  useBootstrap();
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = settings.theme;
    const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.dataset.motion = !settings.animations || settings.reducedMotion || osReduce ? 'off' : 'on';
  }, [settings]);
  return <>{children}</>;
}
