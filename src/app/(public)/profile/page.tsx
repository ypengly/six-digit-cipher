import type { Metadata } from 'next';
import PageContainer from '@/components/layout/PageContainer';
import ProfileView from '@/components/game/ProfileView';

export const metadata: Metadata = { title: 'Profile' };
export default function Page() {
  return <PageContainer><ProfileView /></PageContainer>;
}
