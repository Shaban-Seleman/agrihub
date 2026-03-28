import { getDonorMarket } from '@/api/dashboard';
import { BreakdownList, CompactMetricCard, InsightProgress } from '@/components/app/governance';
import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

export default async function DonorMarketPage() {
  const data = await getDonorMarket();
  const activeProduce = Number(data.activeProduceListings ?? 0);
  const activeDemand = Number(data.activeDemandListings ?? 0);
  const marketTotal = activeProduce + activeDemand;

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Donor market</StatusPill>}
        title="Market activity"
        subtitle="Market linkage is summarized through active produce and demand counts only, keeping this donor view read-only and presentation-ready."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <CompactMetricCard label="Active produce" value={formatNumber(activeProduce)} icon="inventory_2" />
        <CompactMetricCard label="Active demand" value={formatNumber(activeDemand)} icon="shopping_cart" />
        <CompactMetricCard label="Market pulse" value={activeDemand > activeProduce ? 'Buyer-led' : 'Supply-led'} icon="monitoring" tone="sand" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <DetailSection title="Market balance" subtitle="A simple comparison of current supply-side and buyer-side activity.">
          <div className="space-y-4">
            <InsightProgress
              label="Produce share"
              value={`${marketTotal ? Math.round((activeProduce / marketTotal) * 100) : 0}%`}
              percentage={marketTotal ? Math.round((activeProduce / marketTotal) * 100) : 0}
              detail={`${formatNumber(activeProduce)} active produce listings`}
            />
            <InsightProgress
              label="Demand share"
              value={`${marketTotal ? Math.round((activeDemand / marketTotal) * 100) : 0}%`}
              percentage={marketTotal ? Math.round((activeDemand / marketTotal) * 100) : 0}
              detail={`${formatNumber(activeDemand)} active demand listings`}
            />
          </div>
        </DetailSection>
        <DetailSection title="Market totals" subtitle="Aggregated active listing counts across the market linkage module.">
          <BreakdownList
            items={[
              { label: 'Active produce listings', value: formatNumber(activeProduce) },
              { label: 'Active demand listings', value: formatNumber(activeDemand) }
            ]}
          />
        </DetailSection>
      </div>
    </div>
  );
}
