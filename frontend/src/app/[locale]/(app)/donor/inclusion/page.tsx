import { getDonorInclusion } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard, InsightProgress } from '@/components/app/governance';
import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { entriesOf, formatNumber } from '@/lib/presentation';

export default async function DonorInclusionPage() {
  const data = await getDonorInclusion();
  const womenParticipation = Number(data.womenParticipation ?? 0);
  const youthParticipation = Number(data.youthParticipation ?? 0);
  const regions = entriesOf(data.regionParticipation as Record<string, number>);
  const regionTotal = regions.reduce((sum, [, value]) => sum + Number(value ?? 0), 0);
  const maxRegionValue = Math.max(...regions.map(([, value]) => Number(value ?? 0)), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Donor inclusion</StatusPill>}
        title="Inclusive participation"
        subtitle="Women, youth, and region-linked aggregates are shown here to support donor review without exposing raw beneficiary records."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Women participation" value={formatNumber(womenParticipation)} icon="diversity_1" />
        <CompactMetricCard label="Youth participation" value={formatNumber(youthParticipation)} icon="group" />
        <CompactMetricCard label="Regions represented" value={formatNumber(regions.length)} icon="map" />
        <CompactMetricCard label="Profiles with region" value={formatNumber(regionTotal)} icon="location_on" tone="sand" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <DetailSection title="Headline inclusion indicators" subtitle="These values reflect the currently available aggregate dashboard inputs.">
          <div className="space-y-4">
            <InsightProgress
              label="Women share of region-linked profiles"
              value={`${regionTotal ? Math.round((womenParticipation / regionTotal) * 100) : 0}%`}
              percentage={regionTotal ? Math.round((womenParticipation / regionTotal) * 100) : 0}
              detail={`${formatNumber(womenParticipation)} women across recorded profiles`}
            />
            <InsightProgress
              label="Youth share of region-linked profiles"
              value={`${regionTotal ? Math.round((youthParticipation / regionTotal) * 100) : 0}%`}
              percentage={regionTotal ? Math.round((youthParticipation / regionTotal) * 100) : 0}
              detail={`${formatNumber(youthParticipation)} youth across recorded profiles`}
            />
          </div>
        </DetailSection>
        <DetailSection title="Regional breakdown" subtitle="Region-linked participation counts from the aggregated inclusion endpoint.">
          <div className="space-y-3">
            {regions.map(([region, value]) => {
              const count = Number(value ?? 0);
              return (
                <div key={region} className="rounded-[1.5rem] bg-sand p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{region}</span>
                    <span className="text-sm font-bold text-ink">{formatNumber(count)}</span>
                  </div>
                  <InsightProgress
                    label="Participation share"
                    value={`${maxRegionValue ? Math.round((count / maxRegionValue) * 100) : 0}%`}
                    percentage={maxRegionValue ? Math.round((count / maxRegionValue) * 100) : 0}
                  />
                </div>
              );
            })}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
