import Link from 'next/link';
import { PublicSection, PublicShell } from '@/components/layout/public-shell';
import { ActionCard } from '@/components/app/cards';

export default async function AccountTypePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <PublicShell locale={locale}>
      <div className="space-y-8 py-6">
        <PublicSection
          title="Choose your account type"
          subtitle="Select the role that best matches how you will use SamiAgriHub. You will continue into registration and then role-based onboarding."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard href={`/${locale}/register?role=FARMER_YOUTH`} title="Farmer / Youth" description="Learn, record farming activities, access advisory, and connect to market demand." icon="agriculture" cta="Register as farmer" />
            <ActionCard href={`/${locale}/register?role=AGRI_SME`} title="Agri-SME" description="Build a business profile, post demand and opportunities, and appear in the directory." icon="storefront" cta="Register as SME" />
            <ActionCard href={`/${locale}/register?role=PARTNER`} title="Partner / Institution" description="Post opportunities, share institutional support, and participate as a complementary ecosystem partner." icon="handshake" cta="Register as partner" />
          </div>
          <div className="mt-6">
            <Link href={`/${locale}/login`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
              Already registered? Sign in
            </Link>
          </div>
        </PublicSection>
      </div>
    </PublicShell>
  );
}
