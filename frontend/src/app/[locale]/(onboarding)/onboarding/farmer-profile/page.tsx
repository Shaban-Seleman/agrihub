import Link from 'next/link';
import { getCropInterests, getProfileBundle } from '@/api/profile';
import { Button } from '@/components/ui/button';
import { FarmerProfileSection, OnboardingNextActions, OnboardingStepLayout } from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function OnboardingFarmerProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['FARMER_YOUTH']);
  const [profileBundle, cropInterests] = await Promise.all([getProfileBundle(), getCropInterests()]);

  return (
    <OnboardingStepLayout current={2} total={3} title="Farmer Profile Setup" description="Set the required farmer demographic and crop fields before you start learning, tracking, and market participation.">
      <FarmerProfileSection locale={locale} profileBundle={profileBundle} accountType="FARMER_YOUTH" cropSelections={cropInterests} />
      <OnboardingNextActions
        primary={<Link href={`/${locale}/onboarding/crop-interests`}><Button className="w-full">Continue to crop interests</Button></Link>}
        secondary={<Link href={`/${locale}/onboarding/profile`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">Back to shared profile</Link>}
      />
    </OnboardingStepLayout>
  );
}
