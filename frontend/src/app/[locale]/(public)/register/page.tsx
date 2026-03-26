import { getTranslations } from 'next-intl/server';
import { PublicShell } from '@/components/layout/public-shell';
import { RegisterForm } from '@/features/auth/auth-form';

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('auth');

  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-md py-10">
        <h1 className="mb-4 text-3xl font-bold">{t('registerTitle')}</h1>
        <RegisterForm locale={locale} />
      </div>
    </PublicShell>
  );
}
