import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-black/45 focus:border-leaf',
        props.className
      )}
    />
  );
}
