import { getDashboardMarket, getDashboardOverview, getDashboardSmes } from '@/api/dashboard';
import { CompactMetricCard, GovernanceNavCard } from '@/components/app/governance';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatNumber } from '@/lib/presentation';

const adminRoutes = [
  {
    slug: 'businesses',
    title: 'Businesses',
    description: 'Verify directory profiles before they become trusted public records.',
    icon: 'verified_user',
    meta: 'Verification queue'
  },
  {
    slug: 'courses',
    title: 'Courses',
    description: 'Move learning content between draft, published, and archived states.',
    icon: 'school',
    meta: 'Learning content'
  },
  {
    slug: 'advisory',
    title: 'Advisory',
    description: 'Review and publish extension content suitable for broad field guidance.',
    icon: 'article',
    meta: 'Advisory publishing'
  },
  {
    slug: 'market',
    title: 'Market',
    description: 'Moderate produce and demand listings without removing reporting history.',
    icon: 'storefront',
    meta: 'Listing moderation'
  },
  {
    slug: 'opportunities',
    title: 'Opportunities',
    description: 'Keep grants, tenders, and training notices accurate and current.',
    icon: 'rocket_launch',
    meta: 'Opportunity review'
  },
  {
    slug: 'farming',
    title: 'Farming',
    description: 'Review submitted production records that power reporting and seasonal analytics.',
    icon: 'agriculture',
    meta: 'Production oversight'
  },
  {
    slug: 'analytics',
    title: 'Analytics',
    description: 'Review aggregated program signals for oversight and donor-safe reporting.',
    icon: 'monitoring',
    meta: 'Aggregated insights'
  }
] as const;

export default async function AdminHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [overview, market, smes] = await Promise.all([getDashboardOverview(), getDashboardMarket(), getDashboardSmes()]);

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Admin control surface"
        title={
          <>
            Moderate with
            <br />
            <span className="italic text-sun">clarity and trust.</span>
          </>
        }
        subtitle="Use this operational workspace to verify businesses, moderate public records, and keep published content aligned with the approved MVP scope."
        action={
          <Link href={`/${locale}/admin/analytics`}>
            <Button>Open analytics</Button>
          </Link>
        }
        accent={
          <div className="rounded-[2rem] bg-white/10 p-5 text-white ring-1 ring-white/15">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Trusted records</p>
            <p className="mt-3 font-headline text-5xl font-bold">{formatNumber(smes.verifiedBusinesses ?? 0)}</p>
            <p className="mt-2 text-sm text-white/75">Verified SME profiles currently visible through the directory.</p>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Registered users" value={formatNumber(overview.totalUsers ?? 0)} hint="Platform-wide registered accounts." icon="groups" />
        <CompactMetricCard label="Active produce" value={formatNumber(market.activeProduceListings ?? 0)} hint="Public produce listings under moderation oversight." icon="inventory_2" />
        <CompactMetricCard label="Active demand" value={formatNumber(market.activeDemandListings ?? 0)} hint="Buyer requests currently visible in the market hub." icon="shopping_cart" />
        <CompactMetricCard label="Verified SMEs" value={formatNumber(smes.verifiedBusinesses ?? 0)} hint={`${formatNumber(smes.totalBusinesses ?? 0)} total business profiles`} icon="verified" tone="sand" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Control areas"
          title="Operational areas"
          subtitle="Each area focuses on moderation, verification, or publishing within the locked MVP contract."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminRoutes.map((route) => (
            <GovernanceNavCard
              key={route.slug}
              href={`/${locale}/admin/${route.slug}`}
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
