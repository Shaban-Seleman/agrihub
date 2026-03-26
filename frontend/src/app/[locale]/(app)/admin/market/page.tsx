import { adminDemandListings, adminProduceListings } from '@/api/market';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ListingModerationControl } from '@/features/admin/moderation-actions';

export default async function AdminMarketPage() {
  const [produce, demand] = await Promise.all([adminProduceListings(), adminDemandListings()]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Card><h1 className="text-2xl font-bold">Produce moderation</h1><p className="mt-2 text-sm text-ink/70">Move unsafe or stale supply records out of public browsing without deleting reporting history.</p></Card>
        {produce.items?.map((listing: any) => (
          <Card key={listing.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-semibold">{listing.title}</h2><p className="mt-1 text-sm text-ink/70">{listing.cropName}</p></div>
              <Badge>{listing.status}</Badge>
            </div>
            <ListingModerationControl listingId={listing.id} initialStatus={listing.status} kind="produce" />
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <Card><h1 className="text-2xl font-bold">Demand moderation</h1><p className="mt-2 text-sm text-ink/70">Review buyer demand records before they remain active in public market views.</p></Card>
        {demand.items?.map((listing: any) => (
          <Card key={listing.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-semibold">{listing.title}</h2><p className="mt-1 text-sm text-ink/70">{listing.cropName}</p></div>
              <Badge>{listing.status}</Badge>
            </div>
            <ListingModerationControl listingId={listing.id} initialStatus={listing.status} kind="demand" />
          </Card>
        ))}
      </div>
    </div>
  );
}
