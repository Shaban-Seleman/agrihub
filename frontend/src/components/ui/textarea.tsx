import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-28 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none placeholder:text-black/45 focus:border-leaf',
        props.className
      )}
    />
  );
}
