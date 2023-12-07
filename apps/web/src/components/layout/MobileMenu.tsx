'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileMenu({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Open Mobile Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-72"
        side="left"
        onClick={(e) => {
          e.target instanceof HTMLAnchorElement && setOpen(false);
        }}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
