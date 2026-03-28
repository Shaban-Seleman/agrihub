import Link from 'next/link';
import { getProfileBundle } from '@/api/profile';
import { Button } from '@/components/ui/button';
import { OnboardingNextActions, OnboardingStepLayout, PartnerProfileSection } from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function OnboardingPartnerProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['PARTNER']);
  const profileBundle = await getProfileBundle();

  return (
    <OnboardingStepLayout current={2} total={2} title="Partner Profile Setup" description="Complete the organization profile so SamiAgriHub can align your institution to opportunities and complementary support roles.">
      <PartnerProfileSection locale={locale} profileBundle={profileBundle} accountType="PARTNER" />
      <OnboardingNextActions
        primary={<Link href={`/${locale}/partner/dashboard`}><Button className="w-full">Finish onboarding</Button></Link>}
        secondary={<Link href={`/${locale}/onboarding/profile`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">Back to shared profile</Link>}
      />
    </OnboardingStepLayout>
  );
}
