import Link from 'next/link';
import { getAdvisoryRecommendations, getAdvisorySummary, listAdvisory } from '@/api/advisory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/presentation';

export default async function AdvisoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, items, recommendations] = await Promise.all([getAdvisorySummary(), listAdvisory(), getAdvisoryRecommendations()]);
  return (
    <div className="space-y-5">
      <Card className="space-y-4"><Badge>Extension and advisory</Badge><h1 className="text-3xl font-bold">Published advisory guidance</h1><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Published items</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.publishedAdvisoryItems ?? 0)}</p></div></Card>
      <Card><h2 className="font-semibold">Recommended for your profile</h2><div className="mt-4 flex flex-wrap gap-2">{(recommendations ?? []).map((item: any) => <Badge key={item.id}>{item.title}</Badge>)}</div></Card>
      {items.items?.map((item: any) => (
        <Link key={item.id} href={`/${locale}/advisory/${item.id}`}>
          <Card className="space-y-3"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{item.title}</h2><Badge>{item.status}</Badge></div><p className="text-sm text-black/70">{item.summary}</p></Card>
        </Link>
      ))}
    </div>
  );
}
