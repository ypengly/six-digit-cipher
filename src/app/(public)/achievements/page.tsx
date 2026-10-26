import type { Metadata } from 'next';
import PageContainer from '@/components/layout/PageContainer';
import AchievementList from '@/components/achievements/AchievementList';

export const metadata: Metadata = { title: 'Achievements' };
export default function Page() {
  return (
    <PageContainer>
      <h1 className="font-display text-4xl font-bold">Achievements</h1>
      <p className="mb-6 mt-1 text-mute">Earned by reasoning, not by guessing.</p>
      <AchievementList />
    </PageContainer>
  );
}
