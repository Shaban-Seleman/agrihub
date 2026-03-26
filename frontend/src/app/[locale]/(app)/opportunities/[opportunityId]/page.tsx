import Link from 'next/link';
import { getOpportunity } from '@/api/opportunities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateTime, formatEnumLabel } from '@/lib/presentation';

export default async function OpportunityDetailPage({ params }: { params: Promise<{ locale: string; opportunityId: string }> }) {
  const { locale, opportunityId } = await params;
  const opportunity = await getOpportunity(opportunityId);
  return <Card className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">{opportunity.title}</h1><p className="mt-2 text-sm text-ink/70">{formatEnumLabel(opportunity.opportunityType)}</p></div><Badge>{opportunity.status}</Badge></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Deadline</p><p className="mt-2 font-semibold">{formatDateTime(opportunity.deadline)}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Target geography</p><p className="mt-2 font-semibold">{opportunity.regionName || 'Not specified'}</p></div></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Summary</p><p className="mt-2 text-sm text-ink/75">{opportunity.summary}</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">External application</p><p className="mt-2 text-sm text-ink/75">{opportunity.externalApplicationLink || 'Not provided'}</p></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Contact details</p><p className="mt-2 text-sm text-ink/75">{opportunity.contactDetails || 'Not provided'}</p></div></div><Link href={`/${locale}/opportunities/${opportunityId}/edit`}><Button className="mt-2">Edit Opportunity</Button></Link></Card>;
}
