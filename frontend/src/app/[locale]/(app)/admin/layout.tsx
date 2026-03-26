import { redirect } from 'next/navigation';
import { getRoleHomePath } from '@/lib/auth/navigation';
import { getCurrentSession } from '@/lib/auth/session';

export default async function AdminLayout({
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

  if (session.accountType !== 'ADMIN') {
    redirect(getRoleHomePath(locale, session.accountType));
  }

  return children;
}
