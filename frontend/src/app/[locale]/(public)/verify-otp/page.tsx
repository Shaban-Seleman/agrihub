import { PublicShell } from '@/components/layout/public-shell';
import { PublicSection } from '@/components/layout/public-shell';
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

  return (
    <PublicShell locale={locale} compact>
      <div className="py-6">
        <PublicSection title="Verify your OTP" subtitle="Confirm your phone number to activate your account and continue into SamiAgriHub onboarding.">
        <VerifyOtpForm locale={locale} phoneNumber={phone} />
        </PublicSection>
      </div>
    </PublicShell>
  );
}
