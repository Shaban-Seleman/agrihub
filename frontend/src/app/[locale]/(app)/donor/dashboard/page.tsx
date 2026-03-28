import Link from 'next/link';
import { getDonorInclusion, getDonorOverview, getDonorProduction, getDonorSmes } from '@/api/dashboard';
import { CompactMetricCard, GovernanceNavCard } from '@/components/app/governance';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

const donorRoutes = [
  {
    slug: 'overview',
    title: 'Overview',
    description: 'Cross-program headline metrics for donor-safe reporting.',
    icon: 'dashboard',
    meta: 'Program totals'
  },
  {
    slug: 'inclusion',
    title: 'Inclusion',
    description: 'Women, youth, and region-linked participation aggregates.',
    icon: 'diversity_1',
    meta: 'Inclusive reach'
  },
  {
    slug: 'production',
    title: 'Production',
    description: 'Tracked and harvested activity metrics from field records.',
    icon: 'agriculture',
    meta: 'Production signals'
  },
  {
    slug: 'market',
    title: 'Market',
    description: 'Public market activity summarized across produce and demand.',
    icon: 'storefront',
    meta: 'Market activity'
  },
  {
    slug: 'opportunities',
    title: 'Opportunities',
    description: 'Aggregated opportunity availability for platform participants.',
    icon: 'rocket_launch',
    meta: 'Open notices'
  },
  {
    slug: 'smes',
    title: 'SME participation',
    description: 'Business profile and verification totals for ecosystem tracking.',
    icon: 'apartment',
    meta: 'SME engagement'
  }
] as const;

export default async function DonorDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [overview, inclusion, production, smes] = await Promise.all([
    getDonorOverview(),
    getDonorInclusion(),
    getDonorProduction(),
    getDonorSmes()
  ]);
  const totalUsers = Number(overview.totalUsers ?? 0);
  const womenParticipation = Number(inclusion.womenParticipation ?? 0);
  const harvestedActivities = Number(production.harvestedActivities ?? 0);
  const verifiedBusinesses = Number(smes.verifiedBusinesses ?? 0);

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Donor dashboard"
        title={
          <>
            Read-only evidence
            <br />
            <span className="italic text-sun">for program review.</span>
          </>
        }
        subtitle="This space presents donor-safe, aggregated indicators only. No raw personal records or operational moderation controls appear in this view."
        action={
          <Link href={`/${locale}/donor/overview`}>
            <Button>Open overview</Button>
          </Link>
        }
        accent={<StatusPill tone="gold">Read only</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Registered users" value={formatNumber(totalUsers)} icon="groups" />
        <CompactMetricCard label="Women reached" value={formatNumber(womenParticipation)} icon="diversity_1" />
        <CompactMetricCard label="Harvested activities" value={formatNumber(harvestedActivities)} icon="grass" />
        <CompactMetricCard label="Verified SMEs" value={formatNumber(verifiedBusinesses)} icon="verified" tone="sand" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Read-only sections"
          title="Dashboard views"
          subtitle="Each view is optimized for program review, evidence capture, and presentation-friendly interpretation."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {donorRoutes.map((route) => (
            <GovernanceNavCard
              key={route.slug}
              href={`/${locale}/donor/${route.slug}`}
              title={route.title}
              description={route.description}
              icon={route.icon}
              meta={route.meta}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
