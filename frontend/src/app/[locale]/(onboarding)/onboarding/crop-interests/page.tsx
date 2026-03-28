import Link from 'next/link';
import { getBusinessCommodities, getCropInterests, getProfileBundle } from '@/api/profile';
import { Button } from '@/components/ui/button';
import {
  BusinessCommoditiesSection,
  CropInterestSection,
  OnboardingNextActions,
  OnboardingStepLayout
} from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function OnboardingCropInterestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession(['FARMER_YOUTH', 'AGRI_SME']);
  const [profileBundle, cropInterests, commoditySelections] = await Promise.all([
    getProfileBundle(),
    session.accountType === 'FARMER_YOUTH' ? getCropInterests() : Promise.resolve([]),
    session.accountType === 'AGRI_SME' ? getBusinessCommodities() : Promise.resolve([])
  ]);
  const title = session.accountType === 'FARMER_YOUTH' ? 'Crop Interests' : 'Commodity Selection';
  const description = session.accountType === 'FARMER_YOUTH'
    ? 'Choose the crops that matter most to your journey so learning, advisory, and profile completion stay aligned.'
    : 'Choose the commodities your business works with so the directory and market visibility remain accurate.';
  const finishHref = session.accountType === 'FARMER_YOUTH' ? `/${locale}/dashboard` : `/${locale}/sme/dashboard`;

  return (
    <OnboardingStepLayout current={3} total={3} title={title} description={description}>
      {session.accountType === 'FARMER_YOUTH' ? (
        <CropInterestSection locale={locale} profileBundle={profileBundle} accountType="FARMER_YOUTH" cropSelections={cropInterests} />
      ) : (
        <BusinessCommoditiesSection locale={locale} profileBundle={profileBundle} accountType="AGRI_SME" commoditySelections={commoditySelections} />
      )}
      <OnboardingNextActions
        primary={<Link href={finishHref}><Button className="w-full">Finish onboarding</Button></Link>}
        secondary={<Link href={session.accountType === 'FARMER_YOUTH' ? `/${locale}/onboarding/farmer-profile` : `/${locale}/onboarding/business-profile`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">Back to previous step</Link>}
      />
    </OnboardingStepLayout>
  );
}
