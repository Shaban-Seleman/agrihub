import Link from 'next/link';
import { getMarketSummary, listDemand, listProduce } from '@/api/market';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateTime, formatNumber } from '@/lib/presentation';

export default async function MarketPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, produce, demand] = await Promise.all([getMarketSummary(), listProduce(), listDemand()]);

  return (
    <div className="space-y-6">
      <div>
        <Badge>Market linkage</Badge>
        <h1 className="mt-2 text-3xl font-bold">Current market visibility</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/market/produce/new`}><Button>Create Produce Listing</Button></Link>
        <Link href={`/${locale}/market/demand/new`}><Button variant="secondary">Create Demand Listing</Button></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-ink/60">Active produce listings</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.activeProduceListings ?? 0)}</p></Card>
        <Card><p className="text-sm text-ink/60">Active demand listings</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.activeDemandListings ?? 0)}</p></Card>
        <Card><p className="text-sm text-ink/60">Market pulse</p><p className="mt-2 text-lg font-semibold">{Number(summary.activeDemandListings ?? 0) > Number(summary.activeProduceListings ?? 0) ? 'Buyer-led demand' : 'Supply-led visibility'}</p></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Produce</h2>
          {produce.items?.map((listing: any) => (
            <Link key={listing.id} href={`/${locale}/market/produce/${listing.id}`}>
              <Card className="space-y-3"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{listing.title}</h3><Badge>{listing.status}</Badge></div><p className="text-sm text-black/70">{listing.cropName}</p><div className="grid gap-2 text-sm text-ink/70 sm:grid-cols-2"><span>{listing.quantity} {listing.unit}</span><span>Expires {formatDateTime(listing.expiresAt)}</span></div></Card>
            </Link>
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Demand</h2>
          {demand.items?.map((listing: any) => (
            <Link key={listing.id} href={`/${locale}/market/demand/${listing.id}`}>
              <Card className="space-y-3"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{listing.title}</h3><Badge>{listing.status}</Badge></div><p className="text-sm text-black/70">{listing.cropName}</p><div className="grid gap-2 text-sm text-ink/70 sm:grid-cols-2"><span>{listing.quantity} {listing.unit}</span><span>Expires {formatDateTime(listing.expiresAt)}</span></div></Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
