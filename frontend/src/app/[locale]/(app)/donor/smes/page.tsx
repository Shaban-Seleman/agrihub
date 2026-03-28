import { getDonorSmes } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard, InsightProgress } from '@/components/app/governance';
import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

export default async function DonorSmesPage() {
  const data = await getDonorSmes();
  const totalBusinesses = Number(data.totalBusinesses ?? 0);
  const verifiedBusinesses = Number(data.verifiedBusinesses ?? 0);
  const pendingBusinesses = Math.max(totalBusinesses - verifiedBusinesses, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Donor SMEs</StatusPill>}
        title="SME participation"
        subtitle="Business participation is presented as aggregated counts, with verification progress shown at ecosystem level only."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <CompactMetricCard label="Total businesses" value={formatNumber(totalBusinesses)} icon="apartment" />
        <CompactMetricCard label="Verified businesses" value={formatNumber(verifiedBusinesses)} icon="verified" />
        <CompactMetricCard label="Pending or unverified" value={formatNumber(pendingBusinesses)} icon="pending_actions" tone="sand" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <DetailSection title="Verification progress" subtitle="Verified SME share from the aggregated business profile dashboard endpoint.">
          <InsightProgress
            label="Verified SME share"
            value={`${totalBusinesses ? Math.round((verifiedBusinesses / totalBusinesses) * 100) : 0}%`}
            percentage={totalBusinesses ? Math.round((verifiedBusinesses / totalBusinesses) * 100) : 0}
            detail={`${formatNumber(verifiedBusinesses)} verified of ${formatNumber(totalBusinesses)} total businesses`}
          />
        </DetailSection>
        <DetailSection title="SME totals" subtitle="Read-only aggregated counts for donor review.">
          <BreakdownList
            items={[
              { label: 'Total businesses', value: formatNumber(totalBusinesses) },
              { label: 'Verified businesses', value: formatNumber(verifiedBusinesses) },
              { label: 'Pending or unverified', value: formatNumber(pendingBusinesses) }
            ]}
          />
        </DetailSection>
      </div>
    </div>
  );
}
