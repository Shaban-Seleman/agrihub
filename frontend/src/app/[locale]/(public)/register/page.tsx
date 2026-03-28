import Link from 'next/link';
import { PublicShell } from '@/components/layout/public-shell';
import { PublicSection } from '@/components/layout/public-shell';
import { RegisterForm } from '@/features/auth/auth-form';

export default async function RegisterPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: 'FARMER_YOUTH' | 'AGRI_SME' | 'PARTNER' }>;
}) {
  const { locale } = await params;
  const { role } = await searchParams;

  return (
    <PublicShell locale={locale} compact>
      <div className="py-6">
        <PublicSection title="Register for SamiAgriHub" subtitle="Create your secure account first. You will verify your phone number and then continue to the role-specific onboarding steps.">
          <RegisterForm locale={locale} defaultAccountType={role ?? 'FARMER_YOUTH'} />
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href={`/${locale}/account-type`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
              Review account types
            </Link>
            <Link href={`/${locale}/login`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
              Already have an account?
            </Link>
          </div>
        </PublicSection>
      </div>
    </PublicShell>
  );
}
