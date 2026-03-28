import { getDonorProduction } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard, InsightProgress } from '@/components/app/governance';
import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

export default async function DonorProductionPage() {
  const data = await getDonorProduction();
  const totalActivities = Number(data.totalActivities ?? 0);
  const harvestedActivities = Number(data.harvestedActivities ?? 0);
  const trackedFarmers = Number(data.trackedFarmers ?? 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Donor production</StatusPill>}
        title="Production tracking"
        subtitle="Field-record aggregates summarize tracked activity volume, harvested progress, and the number of farmers represented in production data."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <CompactMetricCard label="Tracked activities" value={formatNumber(totalActivities)} icon="agriculture" />
        <CompactMetricCard label="Harvested activities" value={formatNumber(harvestedActivities)} icon="grass" tone="sand" />
        <CompactMetricCard label="Tracked farmers" value={formatNumber(trackedFarmers)} icon="groups" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <DetailSection title="Harvest completion" subtitle="Harvest progress reflects the share of tracked activities updated to harvested status.">
          <InsightProgress
            label="Harvest completion rate"
            value={`${totalActivities ? Math.round((harvestedActivities / totalActivities) * 100) : 0}%`}
            percentage={totalActivities ? Math.round((harvestedActivities / totalActivities) * 100) : 0}
            detail={`${formatNumber(harvestedActivities)} harvested of ${formatNumber(totalActivities)} total activities`}
          />
        </DetailSection>
        <DetailSection title="Production totals" subtitle="Aggregated production metrics only; no raw farmer-level records appear here.">
          <BreakdownList
            items={[
              { label: 'Tracked activities', value: formatNumber(totalActivities) },
              { label: 'Harvested activities', value: formatNumber(harvestedActivities) },
              { label: 'Tracked farmers', value: formatNumber(trackedFarmers) }
            ]}
          />
        </DetailSection>
      </div>
    </div>
  );
}
