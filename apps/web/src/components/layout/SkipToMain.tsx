'use client';

import React from 'react';
import Link from 'next/link';

function useKeyboardCallback<T>(callback: (e: React.UIEvent<T>) => unknown) {
  return React.useCallback(
    (e: React.KeyboardEvent<T>) => {
      // console.log({ key: e.key });
      switch (e.key) {
        case 'Enter': // enter
        case ' ': // space bar
          callback(e);
          break;
        default:
      }
    },
    [callback]
  );
}

const SkipToMain = ({ target = '#main' }: { target?: `#${string}` }) => {
  const handleSkipToMain = React.useCallback(
    (e: React.UIEvent<unknown>) => {
      e.preventDefault();
      const ele = document.querySelector<HTMLElement>(target);
      ele?.scrollIntoView();
      ele?.focus();
    },
    [target]
  );
  const handleKeydown = useKeyboardCallback(handleSkipToMain);
  return (
    <Link
      href={target}
      onClick={handleSkipToMain}
      onKeyDown={handleKeydown}
      className="z-9999 bg-background text-foreground focus-visible:outline-hidden focus-visible:ring-ring absolute left-1/2 block w-52 -translate-x-1/2 -translate-y-full rounded-lg border p-2 text-center transition-transform duration-300 focus:top-2 focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Skip to main content
    </Link>
  );
};

export { SkipToMain };
