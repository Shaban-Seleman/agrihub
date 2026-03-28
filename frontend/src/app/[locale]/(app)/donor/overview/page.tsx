import { getDonorOverview } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard } from '@/components/app/governance';
import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

export default async function DonorOverviewPage() {
  const data = await getDonorOverview();

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Donor overview</StatusPill>}
        title="Program overview"
        subtitle="Headline platform metrics summarized for donor-safe review and reporting confidence."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Registered users" value={formatNumber(data.totalUsers ?? 0)} icon="groups" />
        <CompactMetricCard label="Active produce" value={formatNumber(data.activeProduceListings ?? 0)} icon="inventory_2" />
        <CompactMetricCard label="Active demand" value={formatNumber(data.activeDemandListings ?? 0)} icon="shopping_cart" />
        <CompactMetricCard label="Open opportunities" value={formatNumber(data.activeOpportunities ?? 0)} icon="rocket_launch" tone="sand" />
      </div>
      <DetailSection title="Current platform totals" subtitle="This page intentionally presents aggregated metrics only.">
        <BreakdownList
          items={[
            { label: 'Registered users', value: formatNumber(data.totalUsers ?? 0) },
            { label: 'Active produce listings', value: formatNumber(data.activeProduceListings ?? 0) },
            { label: 'Active demand listings', value: formatNumber(data.activeDemandListings ?? 0) },
            { label: 'Active opportunities', value: formatNumber(data.activeOpportunities ?? 0) },
            { label: 'Published advisory items', value: formatNumber(data.publishedAdvisory ?? 0) }
          ]}
        />
      </DetailSection>
    </div>
  );
}
