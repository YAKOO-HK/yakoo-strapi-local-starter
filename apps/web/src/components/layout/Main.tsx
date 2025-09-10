import { cn } from '@/lib/utils';

export function Main({ id, className, children }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <main className={cn('min-h-100 focus:outline-hidden relative', className)} id={id || 'main'} tabIndex={-1}>
      {children}
    </main>
  );
}
