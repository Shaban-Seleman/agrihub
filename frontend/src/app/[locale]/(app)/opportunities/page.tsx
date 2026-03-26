import Link from 'next/link';
import { getOpportunitySummary, listOpportunities } from '@/api/opportunities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateTime, formatEnumLabel, formatNumber } from '@/lib/presentation';

export default async function OpportunitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, opportunities] = await Promise.all([getOpportunitySummary(), listOpportunities()]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Badge>Opportunity hub</Badge>
          <h1 className="mt-2 text-3xl font-bold">Current opportunities</h1>
        </div>
        <Link href={`/${locale}/opportunities/new`}><Button>Create Opportunity</Button></Link>
      </div>
      <Card><p className="text-sm text-ink/60">Open opportunities</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.activeOpportunities ?? 0)}</p></Card>
      {opportunities.items?.map((opportunity: any) => (
        <Link key={opportunity.id} href={`/${locale}/opportunities/${opportunity.id}`}>
          <Card className="space-y-3"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{opportunity.title}</h2><Badge>{opportunity.status}</Badge></div><p className="text-sm text-black/70">{formatEnumLabel(opportunity.opportunityType)}</p><div className="grid gap-2 text-sm text-ink/70 sm:grid-cols-2"><span>Deadline {formatDateTime(opportunity.deadline)}</span><span>{opportunity.regionName || 'Multiple regions'}</span></div></Card>
        </Link>
      ))}
    </div>
  );
}
