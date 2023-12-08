'use client';

import { useEffect, useState } from 'react';
import { ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function useShowBackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // console.log({
      //   scrollY: window.scrollY,
      //   innerHeight: window.innerHeight,
      //   show: window.scrollY > window.innerHeight / 3,
      // });
      // eslint-disable-next-line no-undef
      if (window.scrollY > window.innerHeight / 3) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    // eslint-disable-next-line no-undef
    window.addEventListener('scroll', handleScroll);
    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return show;
}

export function BackToTopButton() {
  const showButton = useShowBackToTop();
  return (
    <button
      className={cn(
        'bg-foreground text-background shadow-foreground/50 ring-offset-background focus-visible:ring-ring fixed bottom-4 right-4 z-50 rounded-full p-2 shadow-sm transition-opacity duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        { 'opacity-100': showButton, 'pointer-events-none opacity-0': !showButton }
      )}
      // eslint-disable-next-line no-undef
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
    >
      <span className="sr-only">Back to top</span>
      <ChevronUpIcon className="h-6 w-6" aria-hidden />
    </button>
  );
}
