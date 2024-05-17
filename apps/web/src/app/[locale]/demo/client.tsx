'use client';

import CountUp from 'react-countup';

export const ABOUT_US = [
  { number: 12, symbol: '', label: 'Years of Services' },
  { number: 250, symbol: '+', label: 'Projects Completed' },
  { number: 100, symbol: '+', label: 'Trusted Clients' },
  { number: 5000, symbol: '+', label: 'Cups of Coffee Consumed' },
];

export function CountNumbers() {
  return (
    <div className="mx-auto flex flex-wrap items-start justify-center gap-6 text-center">
      {ABOUT_US.map(({ number, symbol, label }, index) => (
        <div key={index} className="flex shrink-0 grow-0 basis-32 flex-col items-center justify-start">
          <span className="flex items-end text-xl font-bold md:text-4xl">
            <CountUp end={number} duration={5} enableScrollSpy scrollSpyOnce scrollSpyDelay={200} />
            <span className="text-sm md:text-2xl">{symbol}</span>
          </span>
          {label}
        </div>
      ))}
    </div>
  );
}
