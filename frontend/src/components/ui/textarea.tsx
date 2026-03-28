import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-28 w-full rounded-[1.2rem] border border-line/40 bg-sand px-4 py-3 text-sm outline-none placeholder:text-muted/70 focus:border-moss focus:bg-white',
        props.className
      )}
    />
  );
}
