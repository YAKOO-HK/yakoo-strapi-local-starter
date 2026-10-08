import { Main } from '@/components/layout/Main';

export default function Loading() {
  return (
    <Main>
      <div className="container py-8" aria-busy="true" />
    </Main>
  );
}
