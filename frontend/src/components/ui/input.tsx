import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'min-h-14 w-full rounded-[1.2rem] border border-line/40 bg-sand px-4 py-3 text-sm outline-none ring-0 placeholder:text-muted/70 focus:border-moss focus:bg-white',
        props.className
      )}
    />
  );
}
