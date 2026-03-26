import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { requireSession } from '@/lib/auth/session';

export default async function AuthenticatedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    const session = await requireSession();
    return <AppShell user={session} locale={locale}>{children}</AppShell>;
  } catch {
    redirect(`/${locale}/login`);
  }
}
