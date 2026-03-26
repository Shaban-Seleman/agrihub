import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { canAccessDashboard, canAccessFarming, getRoleHomeSegment } from '@/lib/auth/navigation';
import type { SessionUser } from '@/types/auth';

const baseNavItems = [
  { href: '/learning', label: 'AgriLearn' },
  { href: '/market', label: 'Market' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/directory', label: 'Directory' },
  { href: '/advisory', label: 'Advisory' },
  { href: '/profile', label: 'Profile' }
];

export function AppShell({ children, user, locale }: PropsWithChildren<{ user: SessionUser; locale: string }>) {
  const navItems = [
    { href: getRoleHomeSegment(user.accountType), label: canAccessDashboard(user.accountType) ? 'Dashboard' : 'Home' },
    ...(canAccessFarming(user.accountType) ? [{ href: '/farming-activities', label: 'Farming' }] : []),
    ...baseNavItems
  ].filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <header className="rounded-[1.5rem] bg-ink px-4 py-4 text-white shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">SamiAgriHub</p>
              <h1 className="text-lg font-semibold">{user.phoneNumber}</h1>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{user.accountType}</div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="rounded-full bg-white/10 px-3 py-2 whitespace-nowrap hover:bg-white/20"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="py-6">{children}</main>
      </div>
    </div>
  );
}
