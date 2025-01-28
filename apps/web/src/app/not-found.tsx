'use client';

import { redirect, usePathname } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';

export default function NotFound() {
  const pathname = usePathname();

  // Add a locale prefix to show a localized not found page
  redirect(`/${defaultLocale}${pathname}`);
}
