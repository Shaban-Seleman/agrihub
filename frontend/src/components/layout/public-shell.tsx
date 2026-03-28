import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/app/primitives';
import { cn } from '@/lib/utils/cn';

export function PublicShell({
  children,
  locale,
  compact = false
}: PropsWithChildren<{ locale: string; compact?: boolean }>) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line/20 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf text-sun">
              <Icon name="agriculture" className="text-[22px]" filled />
            </div>
            <div>
              <p className="font-headline text-2xl font-bold italic tracking-tight text-leaf">SamiAgriHub</p>
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Inclusive agriculture platform</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href={`/${locale}/login`} className="rounded-full px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.14em] text-leaf hover:bg-sand">
              Login
            </Link>
            <Link href={`/${locale}/register`} className="rounded-full editorial-gradient px-5 py-3 font-label text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-float">
              Register
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={cn(
          'mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6',
          compact ? 'max-w-3xl' : 'max-w-7xl'
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function PublicSection({
  title,
  subtitle,
  children
}: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-card md:p-8">
      <h1 className="font-headline text-4xl font-bold text-ink md:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
