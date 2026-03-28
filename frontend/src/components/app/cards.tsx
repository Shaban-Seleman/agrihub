import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils/cn';
import { Icon, StatusPill } from './primitives';

export function StatCard({
  label,
  value,
  hint,
  tone = 'light',
  icon
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'light' | 'dark' | 'gold';
  icon?: string;
}) {
  return (
    <Card className={cn(tone === 'dark' && 'editorial-gradient text-white', tone === 'gold' && 'bg-[#fed65b] text-[#241a00]')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn('font-label text-[11px] font-bold uppercase tracking-[0.18em]', tone === 'light' ? 'text-muted' : 'text-current/75')}>
            {label}
          </p>
          <div className="mt-3 font-headline text-4xl font-bold">{value}</div>
          {hint ? <p className={cn('mt-2 text-sm leading-6', tone === 'light' ? 'text-muted' : 'text-current/80')}>{hint}</p> : null}
        </div>
        {icon ? (
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', tone === 'light' ? 'bg-sand text-leaf' : 'bg-white/10 text-current')}>
            <Icon name={icon} className="text-[24px]" filled />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function MetricTile({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-[1.6rem] bg-sand p-4">
      <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-headline text-3xl font-bold text-ink">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

export function ActionCard({
  title,
  description,
  href,
  icon,
  cta
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  cta: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:-translate-y-0.5">
        <div className="flex h-full flex-col justify-between gap-5">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-leaf">
              <Icon name={icon} className="text-[24px]" filled />
            </div>
            <h3 className="mt-5 font-headline text-2xl font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </div>
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">{cta}</span>
        </div>
      </Card>
    </Link>
  );
}

export function CourseCard({
  href,
  title,
  description,
  lessons,
  progress,
  status,
  actionLabel
}: {
  href: string;
  title: string;
  description: string;
  lessons: string;
  progress: number;
  status: string;
  actionLabel: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full overflow-hidden">
        <div className="mb-5 flex items-start justify-between gap-3">
          <StatusPill tone={progress > 0 ? 'green' : 'gold'}>{status}</StatusPill>
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{lessons}</span>
        </div>
        <h3 className="font-headline text-3xl font-bold text-ink">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <div className="mt-5 font-label text-[11px] font-bold uppercase tracking-[0.18em] text-leaf">{actionLabel}</div>
      </Card>
    </Link>
  );
}

export function ActivityCard({
  href,
  title,
  badge,
  subtitle,
  meta,
  accent
}: {
  href: string;
  title: string;
  badge: ReactNode;
  subtitle: string;
  meta: Array<string>;
  accent?: ReactNode;
}) {
  return (
    <Link href={href}>
      <Card className="h-full overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4">{badge}</div>
            <h3 className="font-headline text-3xl font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </div>
          {accent ? <div>{accent}</div> : null}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item} className="rounded-[1.25rem] bg-sand px-4 py-3 text-sm font-semibold text-ink">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </Link>
  );
}

export function MarketListingCard({
  href,
  title,
  crop,
  quantity,
  expiry,
  badge,
  location,
  tone = 'light'
}: {
  href: string;
  title: string;
  crop: string;
  quantity: string;
  expiry: string;
  badge: ReactNode;
  location?: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <Link href={href}>
      <Card className={cn('h-full', tone === 'dark' && 'editorial-gradient text-white')}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-4">{badge}</div>
            <h3 className="font-headline text-3xl font-bold">{title}</h3>
            <p className={cn('mt-2 text-sm', tone === 'dark' ? 'text-white/75' : 'text-muted')}>{crop}</p>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', tone === 'dark' ? 'bg-white/10' : 'bg-sand')}>
            <Icon name="local_shipping" className="text-[22px] text-sun" filled />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className={cn('rounded-[1.25rem] px-4 py-3', tone === 'dark' ? 'bg-white/10' : 'bg-sand')}>
            <p className={cn('font-label text-[11px] font-bold uppercase tracking-[0.16em]', tone === 'dark' ? 'text-white/70' : 'text-muted')}>Quantity</p>
            <p className="mt-1 text-sm font-semibold">{quantity}</p>
          </div>
          <div className={cn('rounded-[1.25rem] px-4 py-3', tone === 'dark' ? 'bg-white/10' : 'bg-sand')}>
            <p className={cn('font-label text-[11px] font-bold uppercase tracking-[0.16em]', tone === 'dark' ? 'text-white/70' : 'text-muted')}>Expires</p>
            <p className="mt-1 text-sm font-semibold">{expiry}</p>
          </div>
          {location ? (
            <div className={cn('rounded-[1.25rem] px-4 py-3', tone === 'dark' ? 'bg-white/10' : 'bg-sand')}>
              <p className={cn('font-label text-[11px] font-bold uppercase tracking-[0.16em]', tone === 'dark' ? 'text-white/70' : 'text-muted')}>Location</p>
              <p className="mt-1 text-sm font-semibold">{location}</p>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}

export function OpportunityCard({
  href,
  title,
  type,
  deadline,
  region,
  summary,
  featured = false
}: {
  href: string;
  title: string;
  type: string;
  deadline: string;
  region: string;
  summary: string;
  featured?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className={cn(featured && 'editorial-gradient text-white')}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <StatusPill tone={featured ? 'gold' : 'green'}>{type}</StatusPill>
          <span className={cn('font-label text-[11px] font-bold uppercase tracking-[0.16em]', featured ? 'text-white/75' : 'text-muted')}>{deadline}</span>
        </div>
        <h3 className="font-headline text-3xl font-bold">{title}</h3>
        <p className={cn('mt-3 text-sm leading-6', featured ? 'text-white/80' : 'text-muted')}>{summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className={cn('rounded-full px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.16em]', featured ? 'bg-white/10 text-white' : 'bg-sand text-muted')}>{region}</span>
        </div>
      </Card>
    </Link>
  );
}

export function DirectoryCard({
  href,
  title,
  type,
  verification,
  description,
  commodities
}: {
  href: string;
  title: string;
  type: string;
  verification: string;
  description: string;
  commodities: string[];
}) {
  return (
    <Link href={href}>
      <Card className="h-full">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <StatusPill tone="green">{verification}</StatusPill>
            <h3 className="mt-4 font-headline text-3xl font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm font-semibold text-muted">{type}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-leaf">
            <Icon name="domain" className="text-[24px]" filled />
          </div>
        </div>
        <p className="text-sm leading-6 text-muted">{description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {commodities.slice(0, 3).map((commodity) => (
            <StatusPill key={commodity} tone="muted">
              {commodity}
            </StatusPill>
          ))}
        </div>
      </Card>
    </Link>
  );
}
