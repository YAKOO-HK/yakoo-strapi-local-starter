// Since we have a root `not-found.tsx` page, a layout file

import { Providers } from './client';

// is required, even if it's just passing children through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
