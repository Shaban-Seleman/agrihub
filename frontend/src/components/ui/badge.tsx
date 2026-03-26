import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn('inline-flex rounded-full bg-sand px-3 py-1 text-xs font-semibold text-soil', className)}>
      {children}
    </span>
  );
}
