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
    return <div className="min-h-screen bg-cream px-4 py-10 sm:px-6">{children}</div>;
  } catch {
    redirect(`/${locale}/login`);
  }
}
