import { type Metadata } from 'next';
import { Main } from '@/components/layout/Main';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Page Not Found (404)',
  robots: {
    index: false,
    follow: false,
  },
};
export default function NotFound() {
  return (
    <Main className="prose prose-neutral container py-8">
      <h1 className={cn(typographyVariants({ variant: 'h1' }))}>Page Not Found (404)</h1>
      <p>Could not find requested resource.</p>
    </Main>
  );
}
