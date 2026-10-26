import { cn } from '@/lib/utils';
const tone: Record<string, string> = {
  Beginner: 'text-ok border-ok/40', Intermediate: 'text-accent border-accent/40', Advanced: 'text-accent2 border-accent2/40',
  Expert: 'text-bad border-bad/40', Master: 'text-bad border-bad bg-bad/10',
};
export default function DifficultyBadge({ level }: { level: string }) {
  return <span className={cn('chip', tone[level])}>{level}</span>;
}
