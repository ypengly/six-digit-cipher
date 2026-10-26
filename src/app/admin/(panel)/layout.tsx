import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/PageContainer';

export const dynamic = 'force-dynamic';

/** Server-side gate: nothing under /admin (except /admin/login) renders for non-admins. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect('/admin/login');
  return (
    <PageContainer>
      <nav aria-label="Admin" className="mb-6 flex flex-wrap items-center gap-2 border-b border-edge/60 pb-3 text-sm">
        <span className="h-label mr-3">Admin · {admin.displayName}</span>
        {[['/admin/dashboard', 'Dashboard'], ['/admin/levels', 'Levels'], ['/admin/challenges', 'Daily challenges']].map(([h, l]) => <Link key={h} href={h} className="btn-ghost !py-1.5">{l}</Link>)}
      </nav>
      {children}
    </PageContainer>
  );
}
