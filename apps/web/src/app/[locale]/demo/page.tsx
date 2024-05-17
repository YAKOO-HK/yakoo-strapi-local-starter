import { notFound } from 'next/navigation';
import { CountNumbers } from './client';

export default function DemoPage() {
  if (process.env.NODE_ENV === 'production') {
    // only show this page in development mode
    notFound();
  }
  return (
    <div>
      <h1>This a demo page for different components</h1>
      <h2>Count Numbers</h2>
      <CountNumbers />
    </div>
  );
}
