import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth/session';

export default async function OnboardingLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    await requireSession(['FARMER_YOUTH', 'AGRI_SME', 'PARTNER']);
    return children;
  } catch {
    redirect(`/${locale}/login`);
  }
}
