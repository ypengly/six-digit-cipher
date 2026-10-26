import { cn } from '@/lib/utils';
export default function PageContainer({ children, className, narrow }: { children: React.ReactNode; className?: string; narrow?: boolean }) {
  return <main id="main" className={cn('mx-auto w-full px-4 py-8', narrow ? 'max-w-3xl' : 'max-w-6xl', className)}>{children}</main>;
}
