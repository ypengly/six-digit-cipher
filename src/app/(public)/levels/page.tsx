import type { Metadata } from 'next';
import PageContainer from '@/components/layout/PageContainer';
import LevelGrid from '@/components/levels/LevelGrid';
import { listSummaries } from '@/lib/levels';
import LevelsHeader from '@/components/levels/LevelsHeader';

export const metadata: Metadata = { title: 'Levels' };
export const dynamic = 'force-dynamic';

export default async function LevelsPage() {
  const levels = await listSummaries();
  return (
    <PageContainer>
      <LevelsHeader />
      {levels.length === 0
        ? <p className="card p-8 text-center text-mute">No levels are published yet. Run the database seed (see README).</p>
        : <LevelGrid levels={levels} />}
    </PageContainer>
  );
}
