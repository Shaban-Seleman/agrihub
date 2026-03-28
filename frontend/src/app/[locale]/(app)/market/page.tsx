import Link from 'next/link';
import { getMarketSummary, listDemand, listProduce } from '@/api/market';
import { MarketListingCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { FilterChip, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatNumber } from '@/lib/presentation';

export default async function MarketPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, produce, demand] = await Promise.all([getMarketSummary(), listProduce(), listDemand()]);

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Market linkage"
        title={
          <>
            Harvest to
            <br />
            <span className="italic text-soil">household.</span>
          </>
        }
        subtitle="Browse buyer demand, manage your produce visibility, and respond to active market signals in one place."
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active>Buy demand</FilterChip>
        <FilterChip>Sell produce</FilterChip>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/market/produce/new`}><Button>Create Produce Listing</Button></Link>
        <Link href={`/${locale}/market/demand/new`}><Button variant="secondary">Create Demand Listing</Button></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active produce" value={formatNumber(summary.activeProduceListings ?? 0)} hint="Visible farmer-side produce listings" icon="inventory_2" />
        <StatCard label="Active demand" value={formatNumber(summary.activeDemandListings ?? 0)} hint="Buyer requests currently open in the market hub" icon="shopping_cart" />
        <StatCard label="Market pulse" value={Number(summary.activeDemandListings ?? 0) > Number(summary.activeProduceListings ?? 0) ? 'Buyer-led' : 'Supply-led'} hint="A quick signal from current listing balance" icon="insights" tone="gold" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-5">
          <SectionHeader eyebrow="Sell produce" title="Your supply side" subtitle="Current visible produce listings in the public market view." />
          <div className="grid gap-4">
            {produce.items?.map((listing: any) => (
              <MarketListingCard
                key={listing.id}
                href={`/${locale}/market/produce/${listing.id}`}
                title={listing.title}
                crop={listing.cropName}
                quantity={`${formatNumber(listing.quantity)} ${listing.unit}`}
                expiry={formatDateTime(listing.expiresAt)}
                location={listing.regionName || listing.districtName || 'Tanzania'}
                badge={<StatusPill tone="green">{listing.status}</StatusPill>}
              />
            ))}
          </div>
        </section>
        <section className="space-y-5">
          <SectionHeader eyebrow="Buy demand" title="Active buyer requests" subtitle="Demand listings that can inform what to grow, aggregate, or supply next." />
          <div className="grid gap-4">
            {demand.items?.map((listing: any, index: number) => (
              <MarketListingCard
                key={listing.id}
                href={`/${locale}/market/demand/${listing.id}`}
                title={listing.title}
                crop={listing.cropName}
                quantity={`${formatNumber(listing.quantity)} ${listing.unit}`}
                expiry={formatDateTime(listing.expiresAt)}
                location={listing.regionName || listing.districtName || 'Tanzania'}
                badge={<StatusPill tone={index === 0 ? 'gold' : 'green'}>{listing.status}</StatusPill>}
                tone={index === 0 ? 'dark' : 'light'}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
