import type { PropsWithChildren, ReactNode } from 'react';
import { canAccessFarming, getFriendlyRoleLabel, getPreferredDisplayName, getRoleHomeSegment } from '@/lib/auth/navigation';
import type { SessionUser } from '@/types/auth';
import { cn } from '@/lib/utils/cn';
import { Icon, StatusPill } from './primitives';
import { BottomNav } from './bottom-nav';
import Link from 'next/link';
import { LogoutButton } from '@/features/auth/account-security';

export function PageShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 pb-28 pt-24 sm:px-6', className)}>{children}</div>;
}

export function AppHeader({
  user,
  locale,
  profileBundle
}: {
  user: SessionUser;
  locale: string;
  profileBundle?: {
    sharedProfile?: { fullName?: string | null } | null;
    roleProfile?: { businessName?: string | null; organizationName?: string | null } | null;
  } | null;
}) {
  const navItems = [
    { href: getRoleHomeSegment(user.accountType), label: user.accountType === 'FARMER_YOUTH' ? 'Home' : 'Profile', icon: 'home' },
    ...(canAccessFarming(user.accountType) ? [{ href: '/farming-activities', label: 'Farming', icon: 'agriculture' }] : []),
    { href: '/learning', label: 'Learn', icon: 'school' },
    { href: '/market', label: 'Market', icon: 'storefront' },
    { href: '/directory', label: 'Directory', icon: 'apartment' }
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index);
  const displayName = getPreferredDisplayName(user, profileBundle);
  const roleLabel = getFriendlyRoleLabel(user.accountType);
  const avatarLabel = displayName === user.phoneNumber
    ? user.phoneNumber.slice(-2)
    : displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/20 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf text-sun">
              <Icon name="agriculture" className="text-[22px]" filled />
            </div>
            <div>
              <p className="font-headline text-2xl font-bold italic tracking-tight text-leaf">SamiAgriHub</p>
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{roleLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{displayName}</p>
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{roleLabel}</p>
              </div>
              <StatusPill tone="muted">{user.phoneNumber}</StatusPill>
            </div>
            <LogoutButton locale={locale} variant="ghost" className="hidden sm:inline-flex" />
            <Link
              href={`/${locale}/profile`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sand font-label text-sm font-bold uppercase text-leaf"
            >
              {avatarLabel}
            </Link>
          </div>
        </div>
      </header>
      <BottomNav locale={locale} items={navItems} />
    </>
  );
}

export function PageHeader({
  badge,
  title,
  subtitle,
  action,
  className
}: {
  badge?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-3xl">
        {badge ? <div className="mb-3">{badge}</div> : null}
        <h1 className="font-headline text-4xl font-bold tracking-tight text-ink md:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-sm leading-7 text-muted md:text-base">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">{eyebrow}</p> : null}
        <h2 className="mt-2 font-headline text-3xl font-bold text-ink">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function HeroPanel({
  eyebrow,
  title,
  subtitle,
  action,
  accent
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  accent?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] cream-panel p-6 shadow-card md:p-8">
      <div className="absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15),_transparent_65%)]" />
      <div className="relative z-10 grid gap-5 md:grid-cols-[1.4fr_0.6fr] md:items-end">
        <div>
          {eyebrow ? <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">{eyebrow}</p> : null}
          <div className="mt-2 font-headline text-4xl font-bold tracking-tight text-leaf md:text-6xl">{title}</div>
          {subtitle ? <div className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">{subtitle}</div> : null}
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
        {accent ? <div className="md:justify-self-end">{accent}</div> : null}
      </div>
    </section>
  );
}
