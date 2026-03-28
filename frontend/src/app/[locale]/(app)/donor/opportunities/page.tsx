import { getDonorOpportunities, getDonorOverview } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard } from '@/components/app/governance';
import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

export default async function DonorOpportunitiesPage() {
  const [data, overview] = await Promise.all([getDonorOpportunities(), getDonorOverview()]);
  const activeOpportunities = Number(data.activeOpportunities ?? 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Donor opportunities</StatusPill>}
        title="Opportunity access"
        subtitle="This view summarizes opportunity availability through aggregated counts rather than operational records."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <CompactMetricCard label="Active opportunities" value={formatNumber(activeOpportunities)} icon="rocket_launch" />
        <CompactMetricCard label="Published advisory" value={formatNumber(overview.publishedAdvisory ?? 0)} icon="article" tone="sand" />
        <CompactMetricCard label="Platform users" value={formatNumber(overview.totalUsers ?? 0)} icon="groups" />
      </div>
      <DetailSection title="Opportunity ecosystem summary" subtitle="These totals support donor review of the opportunity access layer without exposing applicant-level records.">
        <BreakdownList
          items={[
            { label: 'Active opportunities', value: formatNumber(activeOpportunities) },
            { label: 'Published advisory items', value: formatNumber(overview.publishedAdvisory ?? 0), detail: 'Related support content available on the platform' },
            { label: 'Registered users', value: formatNumber(overview.totalUsers ?? 0), detail: 'Potential reach for opportunity visibility' }
          ]}
        />
      </DetailSection>
    </div>
  );
}
