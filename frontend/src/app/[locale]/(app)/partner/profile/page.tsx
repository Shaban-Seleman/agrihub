import { getProfileBundle } from '@/api/profile';
import { HeroPanel } from '@/components/app/layout';
import { PartnerProfileSection } from '@/features/profile/profile-form';
import { requireSession } from '@/lib/auth/session';

export default async function PartnerProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['PARTNER']);
  const profileBundle = await getProfileBundle();

  return (
    <div className="space-y-8">
      <HeroPanel eyebrow="Partner profile" title={profileBundle.roleProfile?.organizationName || 'Partner profile'} subtitle="Update the institutional profile that frames your role in the broader SamiAgriHub ecosystem." />
      <PartnerProfileSection locale={locale} profileBundle={profileBundle} accountType="PARTNER" />
    </div>
  );
}
