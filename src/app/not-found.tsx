import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';

export default function NotFound() {
  return (
    <PageContainer narrow>
      <div className="card-glow p-8 text-center">
        <p className="font-mono text-5xl text-accent">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold">No such vault door</h1>
        <p className="mt-2 text-mute">That page does not exist, or that level is not published.</p>
        <Link href="/levels" className="btn-primary mt-6">Back to levels</Link>
      </div>
    </PageContainer>
  );
}
