import { getTranslations } from 'next-intl/server';
import { PublicShell } from '@/components/layout/public-shell';
import { VerifyOtpForm } from '@/features/auth/auth-form';

export default async function VerifyOtpPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { locale } = await params;
  const { phone } = await searchParams;
  const t = await getTranslations('auth');

  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-md py-10">
        <h1 className="mb-4 text-3xl font-bold">{t('verifyTitle')}</h1>
        <VerifyOtpForm locale={locale} phoneNumber={phone} />
      </div>
    </PublicShell>
  );
}
