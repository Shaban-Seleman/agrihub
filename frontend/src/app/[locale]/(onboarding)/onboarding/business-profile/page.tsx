import Link from 'next/link';
import { getBusinessCommodities, getProfileBundle } from '@/api/profile';
import { Button } from '@/components/ui/button';
import { BusinessProfileSection, OnboardingNextActions, OnboardingStepLayout } from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function OnboardingBusinessProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['AGRI_SME']);
  const [profileBundle, commoditySelections] = await Promise.all([getProfileBundle(), getBusinessCommodities()]);

  return (
    <OnboardingStepLayout current={2} total={3} title="Business Profile Setup" description="Complete the business profile details that power the SME directory, opportunities, and market participation.">
      <BusinessProfileSection locale={locale} profileBundle={profileBundle} accountType="AGRI_SME" commoditySelections={commoditySelections} />
      <OnboardingNextActions
        primary={<Link href={`/${locale}/onboarding/crop-interests`}><Button className="w-full">Continue to commodities</Button></Link>}
        secondary={<Link href={`/${locale}/onboarding/profile`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">Back to shared profile</Link>}
      />
    </OnboardingStepLayout>
  );
}
