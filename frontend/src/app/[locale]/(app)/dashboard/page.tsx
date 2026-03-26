import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDashboardInclusion, getDashboardMarket, getDashboardOpportunities, getDashboardOverview, getDashboardProduction, getDashboardSmes } from '@/api/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { canAccessDashboard, getRoleHomePath } from '@/lib/auth/navigation';
import { requireSession } from '@/lib/auth/session';
import { formatNumber } from '@/lib/presentation';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession();

  if (!canAccessDashboard(session.accountType)) {
    redirect(getRoleHomePath(locale, session.accountType));
  }

  const [overview, inclusion, production, market, opportunities, smes] = await Promise.all([
    getDashboardOverview(),
    getDashboardInclusion(),
    getDashboardProduction(),
    getDashboardMarket(),
    getDashboardOpportunities(),
    getDashboardSmes()
  ]);

  const quickLinks = [
    { href: `/${locale}/learning`, label: 'Continue learning' },
    { href: `/${locale}/farming-activities/new`, label: 'Add farming activity' },
    { href: `/${locale}/market`, label: 'Explore market' },
    { href: `/${locale}/opportunities`, label: 'View opportunities' }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] bg-gradient-to-br from-leaf to-ink p-6 text-white shadow-card">
        <Badge className="bg-white/15 text-white">Impact dashboard</Badge>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h1 className="text-3xl font-bold">Action hub for learning, production, and market readiness</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
              Track progress across participation, farming outcomes, active market visibility, and business inclusion in one place.
            </p>
          </div>
          <Card className="bg-white/10 text-white shadow-none ring-1 ring-white/10">
            <p className="text-sm text-white/70">Active outreach</p>
            <p className="mt-3 text-4xl font-bold">{formatNumber(Number(overview.totalUsers ?? 0))}</p>
            <p className="mt-2 text-sm text-white/70">registered users currently contributing data</p>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => (
          <Card key={link.href}>
            <h2 className="font-semibold">{link.label}</h2>
            <p className="mt-2 text-sm text-ink/70">Open this workflow and continue from the next key action.</p>
            <Link href={link.href}><Button className="mt-4 w-full">{link.label}</Button></Link>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-ink/60">Active produce listings</p><p className="mt-3 text-3xl font-bold">{formatNumber(Number(market.activeProduceListings ?? 0))}</p></Card>
        <Card><p className="text-sm text-ink/60">Active demand listings</p><p className="mt-3 text-3xl font-bold">{formatNumber(Number(market.activeDemandListings ?? 0))}</p></Card>
        <Card><p className="text-sm text-ink/60">Women participation</p><p className="mt-3 text-3xl font-bold">{formatNumber(Number(inclusion.womenParticipation ?? 0))}</p></Card>
        <Card><p className="text-sm text-ink/60">Youth participation</p><p className="mt-3 text-3xl font-bold">{formatNumber(Number(inclusion.youthParticipation ?? 0))}</p></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Regional inclusion</h2>
            <Badge>{Object.keys((inclusion.regionParticipation as Record<string, number>) ?? {}).length} regions</Badge>
          </div>
          <div className="space-y-3">
            {Object.entries((inclusion.regionParticipation as Record<string, number>) ?? {}).map(([region, value]) => (
              <div key={region} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                <span className="font-medium">{region}</span>
                <span className="text-sm text-ink/70">{formatNumber(value)} profiles</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Outcome snapshot</h2>
          <div className="space-y-3">
            <div className="rounded-2xl bg-cream px-4 py-3"><p className="text-sm text-ink/60">Harvested activities</p><p className="mt-1 text-2xl font-bold">{formatNumber(Number(production.harvestedActivities ?? 0))}</p></div>
            <div className="rounded-2xl bg-cream px-4 py-3"><p className="text-sm text-ink/60">Tracked farmers</p><p className="mt-1 text-2xl font-bold">{formatNumber(Number(production.trackedFarmers ?? 0))}</p></div>
            <div className="rounded-2xl bg-cream px-4 py-3"><p className="text-sm text-ink/60">Open opportunities</p><p className="mt-1 text-2xl font-bold">{formatNumber(Number(opportunities.activeOpportunities ?? 0))}</p></div>
            <div className="rounded-2xl bg-cream px-4 py-3"><p className="text-sm text-ink/60">Verified SMEs</p><p className="mt-1 text-2xl font-bold">{formatNumber(Number(smes.verifiedBusinesses ?? 0))}</p></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
