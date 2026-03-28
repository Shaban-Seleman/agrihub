import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function FormField({
  label,
  hint,
  children,
  className
}: PropsWithChildren<{ label: string; hint?: string; className?: string }>) {
  return (
    <label className={cn('block space-y-2', className)}>
      <span className="block px-1 font-label text-[11px] font-bold uppercase tracking-[0.18em] text-leaf">{label}</span>
      {children}
      {hint ? <span className="block px-1 text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

export function FieldGroup({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('grid gap-4 md:grid-cols-2', className)}>{children}</div>;
}

export function StepIndicator({
  current,
  total
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn('h-1.5 w-9 rounded-full', index < current ? 'bg-sun' : 'bg-mist')}
        />
      ))}
    </div>
  );
}

export function StepWizardHeader({
  current,
  total,
  title,
  description,
  aside
}: {
  current: number;
  total: number;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Step {String(current).padStart(2, '0')} of {String(total).padStart(2, '0')}
          </p>
          <h1 className="mt-2 font-headline text-4xl font-bold text-leaf">{title}</h1>
        </div>
        <StepIndicator current={current} total={total} />
      </div>
      <div className="rounded-[1.6rem] border-l-4 border-sun bg-sand p-5">
        <p className="text-sm leading-7 text-muted">{description}</p>
      </div>
      {aside ? <div>{aside}</div> : null}
    </div>
  );
}

export function CTAButtonRow({
  primary,
  secondary,
  className
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 pt-4', className)}>
      {primary}
      {secondary ? <div className="text-center">{secondary}</div> : null}
    </div>
  );
}
