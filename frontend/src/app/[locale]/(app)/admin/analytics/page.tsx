import { getDashboardInclusion, getDashboardMarket, getDashboardOverview, getDashboardProduction, getDashboardSmes } from '@/api/dashboard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/presentation';

export default async function AdminAnalyticsPage() {
  const [overview, inclusion, production, market, smes] = await Promise.all([
    getDashboardOverview(),
    getDashboardInclusion(),
    getDashboardProduction(),
    getDashboardMarket(),
    getDashboardSmes()
  ]);
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <Badge>Admin analytics</Badge>
        <h1 className="text-3xl font-bold">Aggregated program performance</h1>
        <p className="text-sm text-ink/70">All values are aggregated for oversight and moderation, with no donor-facing raw personal data exposed here.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-ink/60">Registered users</p><p className="mt-2 text-3xl font-bold">{formatNumber(overview.totalUsers)}</p></Card>
        <Card><p className="text-sm text-ink/60">Women participation</p><p className="mt-2 text-3xl font-bold">{formatNumber(Number(inclusion.womenParticipation ?? 0))}</p></Card>
        <Card><p className="text-sm text-ink/60">Harvested activities</p><p className="mt-2 text-3xl font-bold">{formatNumber(Number(production.harvestedActivities ?? 0))}</p></Card>
        <Card><p className="text-sm text-ink/60">Verified SMEs</p><p className="mt-2 text-3xl font-bold">{formatNumber(Number(smes.verifiedBusinesses ?? 0))}</p></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3"><h2 className="text-xl font-semibold">Overview and market</h2><div className="space-y-3"><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Active produce</p><p className="mt-2 font-semibold">{formatNumber(market.activeProduceListings)}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Active demand</p><p className="mt-2 font-semibold">{formatNumber(market.activeDemandListings)}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Published advisory</p><p className="mt-2 font-semibold">{formatNumber(overview.publishedAdvisory)}</p></div></div></Card>
        <Card className="space-y-3"><h2 className="text-xl font-semibold">Regional inclusion</h2>{Object.entries((inclusion.regionParticipation as Record<string, number>) ?? {}).map(([region, value]) => <div key={region} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3"><span className="font-medium">{region}</span><span className="text-sm text-ink/70">{formatNumber(value)}</span></div>)}</Card>
      </div>
    </div>
  );
}
