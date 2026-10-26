'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <PageContainer narrow>
      <div className="card-glow p-8 text-center" role="alert">
        <h1 className="font-display text-3xl font-bold">The vault glitched</h1>
        <p className="mt-2 text-mute">Something went wrong on our side. Your saved progress is safe.</p>
        <button type="button" className="btn-primary mt-6" onClick={reset}>Try again</button>
      </div>
    </PageContainer>
  );
}
