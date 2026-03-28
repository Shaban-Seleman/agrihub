import { requireSession } from '@/lib/auth/session';
import { getCropInterests, getBusinessCommodities, getProfileBundle } from '@/api/profile';
import { OnboardingNextActions, OnboardingStepLayout, SharedProfileSection } from '@/features/profile/profile-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function OnboardingSharedProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession(['FARMER_YOUTH', 'AGRI_SME', 'PARTNER']);
  const [profileBundle, cropInterests, businessCommodities] = await Promise.all([
    getProfileBundle(),
    session.accountType === 'FARMER_YOUTH' ? getCropInterests() : Promise.resolve([]),
    session.accountType === 'AGRI_SME' ? getBusinessCommodities() : Promise.resolve([])
  ]);
  const nextHref = session.accountType === 'FARMER_YOUTH'
    ? `/${locale}/onboarding/farmer-profile`
    : session.accountType === 'AGRI_SME'
      ? `/${locale}/onboarding/business-profile`
      : `/${locale}/onboarding/partner-profile`;

  return (
    <OnboardingStepLayout current={1} total={3} title="Shared Profile Setup" description="Start with your core identity and location details so SamiAgriHub can personalize onboarding, advisory, and geographic reporting.">
      <SharedProfileSection
        locale={locale}
        profileBundle={profileBundle}
        accountType={session.accountType}
        cropSelections={cropInterests}
        commoditySelections={businessCommodities}
      />
      <OnboardingNextActions
        primary={<Link href={nextHref}><Button className="w-full">Continue</Button></Link>}
        secondary={<Link href={`/${locale}/profile`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">Go to profile instead</Link>}
      />
    </OnboardingStepLayout>
  );
}
