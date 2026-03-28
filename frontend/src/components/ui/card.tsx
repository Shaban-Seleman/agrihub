import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-[2rem] border border-line/30 bg-white p-5 shadow-card', className)}>{children}</div>;
}
