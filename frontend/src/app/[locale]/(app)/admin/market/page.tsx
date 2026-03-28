import { adminDemandListings, adminProduceListings } from '@/api/market';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { ModerationActionBar, StatusPill } from '@/components/app/primitives';
import { Card } from '@/components/ui/card';
import { ListingModerationControl } from '@/features/admin/moderation-actions';
import { formatDateTime, formatNumber } from '@/lib/presentation';

export default async function AdminMarketPage() {
  const [produce, demand] = await Promise.all([adminProduceListings(), adminDemandListings()]);
  const produceItems = (produce.items ?? []) as any[];
  const demandItems = (demand.items ?? []) as any[];

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Admin market</StatusPill>}
        title="Market moderation"
        subtitle="Review public produce and demand records, keeping expired or unsafe listings out of active browsing without losing reporting history."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Produce listings" value={formatNumber(produceItems.length)} icon="inventory_2" />
        <CompactMetricCard label="Demand listings" value={formatNumber(demandItems.length)} icon="shopping_bag" />
        <CompactMetricCard label="Active produce" value={formatNumber(produceItems.filter((item) => item.status === 'ACTIVE').length)} icon="check_circle" />
        <CompactMetricCard label="Active demand" value={formatNumber(demandItems.filter((item) => item.status === 'ACTIVE').length)} icon="check_circle" tone="sand" />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Supply side"
            title="Produce listings"
            subtitle="Moderate seller-side records that appear in the public market hub."
          />
          <div className="space-y-4">
            {produceItems.map((listing) => (
              <Card key={listing.id} className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <h2 className="font-headline text-3xl font-bold text-ink">{listing.title}</h2>
                    <p className="mt-2 text-sm text-muted">{listing.cropName}</p>
                  </div>
                  <StatusPill tone={listing.status === 'ACTIVE' ? 'green' : listing.status === 'MODERATED' ? 'gold' : 'muted'}>
                    {listing.status}
                  </StatusPill>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Quantity</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{formatNumber(listing.quantity)} {listing.unit}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Location</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{listing.regionName || listing.districtName || 'Tanzania'}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Expiry</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{formatDateTime(listing.expiresAt)}</p>
                  </div>
                </div>
                <ModerationActionBar>
                  <ListingModerationControl listingId={listing.id} initialStatus={listing.status} kind="produce" />
                </ModerationActionBar>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Buyer side"
            title="Demand listings"
            subtitle="Review buyer-side requests that guide farmer and SME response in the market hub."
          />
          <div className="space-y-4">
            {demandItems.map((listing) => (
              <Card key={listing.id} className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <h2 className="font-headline text-3xl font-bold text-ink">{listing.title}</h2>
                    <p className="mt-2 text-sm text-muted">{listing.cropName}</p>
                  </div>
                  <StatusPill tone={listing.status === 'ACTIVE' ? 'green' : listing.status === 'MODERATED' ? 'gold' : 'muted'}>
                    {listing.status}
                  </StatusPill>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Quantity</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{formatNumber(listing.quantity)} {listing.unit}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Location</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{listing.regionName || listing.districtName || 'Tanzania'}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Expiry</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{formatDateTime(listing.expiresAt)}</p>
                  </div>
                </div>
                <ModerationActionBar>
                  <ListingModerationControl listingId={listing.id} initialStatus={listing.status} kind="demand" />
                </ModerationActionBar>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
