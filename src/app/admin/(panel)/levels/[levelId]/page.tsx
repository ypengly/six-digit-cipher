import LevelEditor from '@/components/admin/LevelEditor';
export const metadata = { title: 'Edit level', robots: { index: false } };
export default async function Page({ params }: { params: Promise<{ levelId: string }> }) {
  return <LevelEditor levelKey={(await params).levelId} />;
}
