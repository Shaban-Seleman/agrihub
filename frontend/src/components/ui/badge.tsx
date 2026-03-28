import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#ffe088] px-3 py-1.5 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-[#574500]',
        className
      )}
    >
      {children}
    </span>
  );
}
