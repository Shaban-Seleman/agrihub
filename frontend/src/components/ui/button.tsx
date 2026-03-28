import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
};

export function Button({ children, className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 font-label text-sm font-bold tracking-[0.08em] uppercase transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'editorial-gradient text-white shadow-float hover:opacity-95 active:scale-[0.98]',
        variant === 'secondary' && 'bg-sand text-ink hover:bg-mist active:scale-[0.98]',
        variant === 'soft' && 'bg-white text-leaf ring-1 ring-line/60 hover:bg-sand active:scale-[0.98]',
        variant === 'ghost' && 'bg-transparent text-leaf hover:bg-leaf/8 active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
