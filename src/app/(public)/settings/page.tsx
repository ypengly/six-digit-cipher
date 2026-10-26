import type { Metadata } from 'next';
import PageContainer from '@/components/layout/PageContainer';
import SettingsView from '@/components/game/SettingsView';

export const metadata: Metadata = { title: 'Settings' };
export default function Page() {
  return <PageContainer narrow><SettingsView /></PageContainer>;
}
