import Link from 'next/link';
import { getOpportunitySummary, listMyOpportunities } from '@/api/opportunities';
import { getBusinessCommodities, getProfileBundle, getProfileCompletion } from '@/api/profile';
import { listMyDemand } from '@/api/market';
import { ActionCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { StatusPill } from '@/components/app/primitives';
import { requireSession } from '@/lib/auth/session';
import { formatNumber } from '@/lib/presentation';

export default async function SmeDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['AGRI_SME']);
  const [profileBundle, completion, commodities, demandListings, opportunitySummary, myOpportunities] = await Promise.all([
    getProfileBundle(),
    getProfileCompletion(),
    getBusinessCommodities(),
    listMyDemand(),
    getOpportunitySummary(),
    listMyOpportunities()
  ]);

  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="SME dashboard"
        title={profileBundle.roleProfile?.businessName || 'Agri-SME workspace'}
        subtitle="Manage your business profile, commodity focus, demand listings, and ecosystem opportunities from one polished SME surface."
        accent={<StatCard label="Profile completion" value={`${completion.percentage}%`} hint="Shared profile, business profile, and commodities all contribute." icon="task_alt" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="My demand listings" value={formatNumber(demandListings.items?.length ?? 0)} hint="Buyer-side listings you have created." icon="shopping_cart" />
        <StatCard label="My opportunities" value={formatNumber(myOpportunities.items?.length ?? 0)} hint="Opportunity posts you currently manage." icon="rocket_launch" />
        <StatCard label="Selected commodities" value={formatNumber(commodities.length)} hint="Crop commodities linked to this SME profile." icon="eco" tone="gold" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard href={`/${locale}/sme/business-profile`} title="Business profile" description="Maintain the business identity used for the directory and SME verification workflows." icon="domain" cta="Open business profile" />
        <ActionCard href={`/${locale}/sme/commodities`} title="Commodity selection" description="Keep commodity focus current so directory and market participation remain accurate." icon="yard" cta="Update commodities" />
        <ActionCard href={`/${locale}/opportunities/new`} title="Post opportunity" description="Publish an SME-led opportunity using the same opportunity hub and moderation rules." icon="tips_and_updates" cta="Create opportunity" />
      </div>
      <section className="rounded-[2rem] bg-white p-6 shadow-card">
        <SectionHeader eyebrow="Commodity focus" title="Current SME commodities" subtitle="These selected crops shape directory visibility and SME relevance." />
        <div className="mt-5 flex flex-wrap gap-2">
          {(commodities ?? []).map((item: any) => <StatusPill key={item.id} tone="green">{item.name}</StatusPill>)}
        </div>
        <div className="mt-6">
          <Link href={`/${locale}/opportunities`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
            Open opportunity hub ({formatNumber(opportunitySummary.activeOpportunities ?? 0)} active)
          </Link>
        </div>
      </section>
    </div>
  );
}
