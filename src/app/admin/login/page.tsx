import type { Metadata } from 'next';
import PageContainer from '@/components/layout/PageContainer';
import AuthForm from '@/components/game/AuthForm';

export const metadata: Metadata = { title: 'Admin sign in', robots: { index: false } };
export default function Page() {
  return <PageContainer narrow><AuthForm adminOnly /></PageContainer>;
}
