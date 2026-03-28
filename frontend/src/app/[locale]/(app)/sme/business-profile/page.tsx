import { getBusinessCommodities, getProfileBundle } from '@/api/profile';
import { HeroPanel } from '@/components/app/layout';
import { BusinessProfileSection } from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function BusinessProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['AGRI_SME']);
  const [profileBundle, commoditySelections] = await Promise.all([getProfileBundle(), getBusinessCommodities()]);

  return (
    <div className="space-y-8">
      <HeroPanel eyebrow="Business profile" title={profileBundle.roleProfile?.businessName || 'Business identity'} subtitle="Update the SME profile used for directory participation, moderation, and business-facing workflows." />
      <BusinessProfileSection locale={locale} profileBundle={profileBundle} accountType="AGRI_SME" commoditySelections={commoditySelections} />
    </div>
  );
}
