import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ children, className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition',
        variant === 'primary' && 'bg-leaf text-white hover:bg-[#25582f]',
        variant === 'secondary' && 'bg-sand text-ink hover:bg-[#e7d9b3]',
        variant === 'ghost' && 'bg-transparent text-leaf hover:bg-leaf/10',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
