import Link from 'next/link';
import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function Icon({
  name,
  className,
  filled = false
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return <span className={cn('material-symbols-outlined', filled && 'filled-symbol', className)}>{name}</span>;
}

export function StatusPill({
  children,
  tone = 'gold',
  className
}: PropsWithChildren<{ tone?: 'gold' | 'green' | 'dark' | 'muted'; className?: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 font-label text-[11px] font-bold uppercase tracking-[0.16em]',
        tone === 'gold' && 'bg-[#ffe088] text-[#574500]',
        tone === 'green' && 'bg-[#c0edd4] text-[#264e3c]',
        tone === 'dark' && 'bg-leaf text-white',
        tone === 'muted' && 'bg-sand text-muted',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  active = false,
  href,
  className
}: PropsWithChildren<{ active?: boolean; href?: string; className?: string }>) {
  const classes = cn(
    'inline-flex items-center rounded-full px-4 py-2 font-label text-xs font-bold uppercase tracking-[0.14em] transition',
    active ? 'bg-leaf text-white' : 'bg-sand text-muted',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}

export function FilterChip(props: PropsWithChildren<{ active?: boolean; href?: string; className?: string }>) {
  return <Chip {...props} />;
}

export function DetailRow({ label, value, icon }: { label: string; value: ReactNode; icon?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/20 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-leaf">
            <Icon name={icon} className="text-[20px]" />
          </div>
        ) : null}
        <span className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{label}</span>
      </div>
      <div className="text-right text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

export function DetailSection({
  title,
  subtitle,
  children,
  className
}: PropsWithChildren<{ title: string; subtitle?: string; className?: string }>) {
  return (
    <section className={cn('rounded-[2rem] border border-line/30 bg-white p-6 shadow-card', className)}>
      <div className="mb-5">
        <h2 className="font-headline text-3xl font-bold text-ink">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function MediaPanel({
  title,
  subtitle,
  imageUrl,
  badge,
  children,
  className
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  imageUrl?: string;
  badge?: ReactNode;
  className?: string;
}>) {
  return (
    <section className={cn('relative overflow-hidden rounded-[2rem] editorial-gradient p-8 text-white shadow-float', className)}>
      {imageUrl ? (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,224,136,0.18),_transparent_35%)]" />
      )}
      <div className="relative z-10">
        {badge ? <div className="mb-5">{badge}</div> : null}
        <h1 className="max-w-3xl font-headline text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">{subtitle}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function ModerationActionBar({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('flex flex-wrap gap-3 rounded-[1.6rem] bg-sand p-4', className)}>
      {children}
    </div>
  );
}
