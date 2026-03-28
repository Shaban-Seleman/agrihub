import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils/cn';
import { Icon } from './primitives';

export function GovernanceNavCard({
  href,
  title,
  description,
  icon,
  meta
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  meta: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:-translate-y-0.5">
        <div className="flex h-full flex-col justify-between gap-5">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-leaf">
              <Icon name={icon} className="text-[22px]" filled />
            </div>
            <h3 className="mt-4 font-headline text-2xl font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </div>
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">{meta}</p>
        </div>
      </Card>
    </Link>
  );
}

export function CompactMetricCard({
  label,
  value,
  hint,
  icon,
  tone = 'light'
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: string;
  tone?: 'light' | 'sand' | 'dark';
}) {
  return (
    <Card className={cn(tone === 'sand' && 'bg-sand', tone === 'dark' && 'editorial-gradient text-white')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn('font-label text-[11px] font-bold uppercase tracking-[0.18em]', tone === 'dark' ? 'text-white/70' : 'text-muted')}>
            {label}
          </p>
          <p className="mt-3 font-headline text-4xl font-bold">{value}</p>
          {hint ? <p className={cn('mt-2 text-sm leading-6', tone === 'dark' ? 'text-white/75' : 'text-muted')}>{hint}</p> : null}
        </div>
        {icon ? (
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-full', tone === 'dark' ? 'bg-white/10 text-white' : 'bg-cream text-leaf')}>
            <Icon name={icon} className="text-[22px]" filled />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function BreakdownList({
  items,
  compact = false
}: {
  items: Array<{ label: string; value: ReactNode; detail?: string }>;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'flex items-center justify-between gap-4 rounded-[1.4rem] bg-sand px-4 py-3',
            compact && 'px-3 py-2.5'
          )}
        >
          <div>
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            {item.detail ? <p className="mt-1 text-xs text-muted">{item.detail}</p> : null}
          </div>
          <div className="text-right text-sm font-bold text-ink">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function InsightProgress({
  label,
  value,
  percentage,
  detail
}: {
  label: string;
  value: ReactNode;
  percentage: number;
  detail?: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-sand p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
          {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
        </div>
        <div className="text-sm font-bold text-ink">{value}</div>
      </div>
      <div className="mt-3">
        <ProgressBar value={percentage} />
      </div>
    </div>
  );
}
