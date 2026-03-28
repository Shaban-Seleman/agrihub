import type { PropsWithChildren } from 'react';
import { AppHeader, PageShell } from '@/components/app/layout';
import type { SessionUser } from '@/types/auth';

export function AppShell({
  children,
  user,
  locale,
  profileBundle
}: PropsWithChildren<{
  user: SessionUser;
  locale: string;
  profileBundle?: {
    sharedProfile?: { fullName?: string | null } | null;
    roleProfile?: { businessName?: string | null; organizationName?: string | null } | null;
  } | null;
}>) {
  return (
    <div className="min-h-screen bg-cream">
      <AppHeader user={user} locale={locale} profileBundle={profileBundle} />
      <PageShell>{children}</PageShell>
    </div>
  );
}
