import { cn } from '@/lib/utils';

export function Main({ id, className, children }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <main className={cn('relative min-h-[25rem] focus:outline-none', className)} id={id || 'main'} tabIndex={-1}>
      {children}
    </main>
  );
}
