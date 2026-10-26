'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Trophy, User, Settings, Grid3x3, CalendarDays } from 'lucide-react';
import { useGame } from '@/store/game-store';
import { cn } from '@/lib/utils';

const links = [
  { href: '/levels', label: 'Levels', icon: Grid3x3 },
  { href: '/play/daily', label: 'Daily', icon: CalendarDays },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const path = usePathname();
  const user = useGame((s) => s.user);
  return (
    <header className="sticky top-0 z-40 border-b border-edge/70 bg-bg/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-wide">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-panel shadow-neon"><Lock size={16} className="text-accent" aria-hidden /></span>
          <span className="hidden sm:inline">SIX-DIGIT <span className="text-accent">CIPHER</span></span>
        </Link>
        <ul className="ml-auto flex items-center gap-1 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} aria-current={path === href ? 'page' : undefined}
                className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-mute hover:text-ink', path === href && 'bg-panel text-ink')}>
                <Icon size={16} aria-hidden /><span className="hidden md:inline">{label}</span><span className="sr-only md:hidden">{label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href={user ? '/profile' : '/account'} className="btn-ghost !py-1.5 text-xs">{user ? user.displayName : 'Sign in'}</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
