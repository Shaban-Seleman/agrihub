import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-leaf',
        props.className
      )}
    />
  );
}
