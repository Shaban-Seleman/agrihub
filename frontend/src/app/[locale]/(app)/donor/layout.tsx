import { redirect } from 'next/navigation';
import { getRoleHomePath } from '@/lib/auth/navigation';
import { getCurrentSession } from '@/lib/auth/session';

export default async function DonorLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  if (session.accountType !== 'DONOR_VIEWER') {
    redirect(getRoleHomePath(locale, session.accountType));
  }

  return children;
}
