import Link from 'next/link';
import { PublicShell } from '@/components/layout/public-shell';
import { PublicSection } from '@/components/layout/public-shell';
import { LoginForm } from '@/features/auth/auth-form';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <PublicShell locale={locale} compact>
      <div className="py-6">
        <PublicSection title="Sign in to SamiAgriHub" subtitle="Use your registered phone number and password to continue into the app.">
          <LoginForm locale={locale} />
          <div className="mt-6">
            <Link href={`/${locale}/register`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
              Need an account? Register here
            </Link>
          </div>
        </PublicSection>
      </div>
    </PublicShell>
  );
}
