import { Star } from 'lucide-react';
export default function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span role="img" aria-label={`${n} of 3 stars`} className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => <Star key={i} size={size} aria-hidden className={i <= n ? 'fill-accent2 text-accent2' : 'text-edge'} />)}
    </span>
  );
}
