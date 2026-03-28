import { getBusinessCommodities, getProfileBundle } from '@/api/profile';
import { HeroPanel } from '@/components/app/layout';
import { BusinessCommoditiesSection } from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function BusinessCommoditiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['AGRI_SME']);
  const [profileBundle, commoditySelections] = await Promise.all([getProfileBundle(), getBusinessCommodities()]);

  return (
    <div className="space-y-8">
      <HeroPanel eyebrow="Commodity selection" title="Choose your business commodities" subtitle="Select the crop commodities your business actively works with in order to keep the directory and market alignment current." />
      <BusinessCommoditiesSection locale={locale} profileBundle={profileBundle} accountType="AGRI_SME" commoditySelections={commoditySelections} />
    </div>
  );
}
