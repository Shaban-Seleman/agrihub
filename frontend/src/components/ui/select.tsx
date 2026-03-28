import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'min-h-14 w-full rounded-[1.2rem] border border-line/40 bg-sand px-4 py-3 text-sm outline-none focus:border-moss focus:bg-white',
        props.className
      )}
    />
  );
}
