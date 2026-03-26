import { getTranslations } from 'next-intl/server';
import { PublicShell } from '@/components/layout/public-shell';
import { LoginForm } from '@/features/auth/auth-form';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('auth');

  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-md py-10">
        <h1 className="mb-4 text-3xl font-bold">{t('loginTitle')}</h1>
        <LoginForm locale={locale} />
      </div>
    </PublicShell>
  );
}
