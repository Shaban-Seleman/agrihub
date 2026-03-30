import { getDashboardInclusion, getDashboardMarket, getDashboardOverview, getDashboardProduction, getDashboardSmes } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard, InsightProgress } from '@/components/app/governance';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { AnalyticsExportActions } from '@/features/admin/analytics-export-actions';
import { entriesOf, formatNumber } from '@/lib/presentation';

export default async function AdminAnalyticsPage() {
  const [overview, inclusion, production, market, smes] = await Promise.all([
    getDashboardOverview(),
    getDashboardInclusion(),
    getDashboardProduction(),
    getDashboardMarket(),
    getDashboardSmes()
  ]);

  const totalUsers = Number(overview.totalUsers ?? 0);
  const womenParticipation = Number(inclusion.womenParticipation ?? 0);
  const youthParticipation = Number(inclusion.youthParticipation ?? 0);
  const totalActivities = Number(production.totalActivities ?? 0);
  const harvestedActivities = Number(production.harvestedActivities ?? 0);
  const verifiedBusinesses = Number(smes.verifiedBusinesses ?? 0);
  const totalBusinesses = Number(smes.totalBusinesses ?? 0);

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Admin analytics"
        title={
          <>
            Aggregated oversight
            <br />
            <span className="italic text-sun">for platform stewardship.</span>
          </>
        }
        subtitle="These views are aggregated for oversight and moderation. They support operational decision-making without exposing donor-facing raw personal data."
        accent={
          <div className="space-y-3">
            <StatusPill tone="gold">Aggregated only</StatusPill>
            <AnalyticsExportActions />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Registered users" value={formatNumber(totalUsers)} icon="groups" />
        <CompactMetricCard label="Women participation" value={formatNumber(womenParticipation)} icon="diversity_1" />
        <CompactMetricCard label="Harvested activities" value={formatNumber(harvestedActivities)} icon="agriculture" />
        <CompactMetricCard label="Verified SMEs" value={formatNumber(verifiedBusinesses)} icon="verified" tone="sand" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Program signals"
            title="Participation and performance"
            subtitle="Track inclusion and production ratios across the approved dashboard aggregates."
          />
          <DetailSection title="Core ratios" subtitle="These ratios are derived from the current aggregated backend metrics only.">
            <div className="space-y-4">
              <InsightProgress
                label="Women participation"
                value={`${totalUsers ? Math.round((womenParticipation / totalUsers) * 100) : 0}%`}
                percentage={totalUsers ? Math.round((womenParticipation / totalUsers) * 100) : 0}
                detail={`${formatNumber(womenParticipation)} of ${formatNumber(totalUsers)} total users`}
              />
              <InsightProgress
                label="Youth participation"
                value={`${totalUsers ? Math.round((youthParticipation / totalUsers) * 100) : 0}%`}
                percentage={totalUsers ? Math.round((youthParticipation / totalUsers) * 100) : 0}
                detail={`${formatNumber(youthParticipation)} of ${formatNumber(totalUsers)} total users`}
              />
              <InsightProgress
                label="Harvest completion"
                value={`${totalActivities ? Math.round((harvestedActivities / totalActivities) * 100) : 0}%`}
                percentage={totalActivities ? Math.round((harvestedActivities / totalActivities) * 100) : 0}
                detail={`${formatNumber(harvestedActivities)} of ${formatNumber(totalActivities)} tracked activities`}
              />
              <InsightProgress
                label="SME verification"
                value={`${totalBusinesses ? Math.round((verifiedBusinesses / totalBusinesses) * 100) : 0}%`}
                percentage={totalBusinesses ? Math.round((verifiedBusinesses / totalBusinesses) * 100) : 0}
                detail={`${formatNumber(verifiedBusinesses)} of ${formatNumber(totalBusinesses)} business profiles`}
              />
            </div>
          </DetailSection>
        </div>

        <div className="space-y-5">
          <DetailSection title="Regional inclusion" subtitle="Users with linked location data grouped by region.">
            <BreakdownList
              items={entriesOf(inclusion.regionParticipation as Record<string, number>).map(([region, value]) => ({
                label: region,
                value: formatNumber(Number(value ?? 0))
              }))}
            />
          </DetailSection>
          <DetailSection title="Current platform totals" subtitle="A quick summary of current public-facing activity across the MVP modules.">
            <BreakdownList
              items={[
                { label: 'Active produce listings', value: formatNumber(market.activeProduceListings ?? 0) },
                { label: 'Active demand listings', value: formatNumber(market.activeDemandListings ?? 0) },
                { label: 'Active opportunities', value: formatNumber(overview.activeOpportunities ?? 0) },
                { label: 'Published advisory items', value: formatNumber(overview.publishedAdvisory ?? 0) }
              ]}
            />
          </DetailSection>
        </div>
      </div>
    </div>
  );
}
