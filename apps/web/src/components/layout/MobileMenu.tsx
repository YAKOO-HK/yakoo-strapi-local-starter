'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function MobileMenu({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className={cn('size-6 text-primary dark:text-white')} />
          <span className="sr-only">Open Mobile Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-80 overflow-y-auto bg-accent"
        side="right"
        onClick={(e) => {
          e.target instanceof HTMLAnchorElement && setOpen(false);
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Menu</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
