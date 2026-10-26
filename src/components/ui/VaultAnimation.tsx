'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGame } from '@/store/game-store';

/** Animated vault dial with six digit slots. Static when animations are off. */
export default function VaultAnimation() {
  const anim = useGame((s) => s.settings.animations && !s.settings.reducedMotion);
  const osReduce = useReducedMotion();
  const live = anim && !osReduce;
  const [d, setD] = useState([6, 4, 1, 1, 0, 6]);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setD((p) => p.map((x) => (Math.random() < 0.4 ? Math.floor(Math.random() * 10) : x))), 700);
    return () => clearInterval(t);
  }, [live]);
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center" aria-hidden>
      {[100, 78, 56].map((s, i) => (
        <motion.div key={s} className="absolute rounded-full border-2 border-dashed"
          style={{ width: `${s}%`, height: `${s}%`, borderColor: i === 1 ? 'rgb(var(--accent2) / .6)' : 'rgb(var(--accent) / .5)' }}
          animate={live ? { rotate: i % 2 ? -360 : 360 } : undefined} transition={{ repeat: Infinity, duration: 40 - i * 9, ease: 'linear' }} />
      ))}
      <div className="card-glow pulse-glow relative z-10 flex gap-1.5 p-3">
        {d.map((x, i) => <span key={i} className="grid h-11 w-8 place-items-center rounded-md bg-bg font-mono text-xl text-accent shadow-inner">{x}</span>)}
      </div>
    </div>
  );
}
