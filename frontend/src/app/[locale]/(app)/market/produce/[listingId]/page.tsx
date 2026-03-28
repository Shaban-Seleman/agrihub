import Link from 'next/link';
import { getProduceListing } from '@/api/market';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { HeroPanel } from '@/components/app/layout';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/presentation';

export default async function ProduceDetailPage({ params }: { params: Promise<{ locale: string; listingId: string }> }) {
  const { locale, listingId } = await params;
  const listing = await getProduceListing(listingId);
  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="Produce listing"
        title={listing.title}
        subtitle={listing.cropName}
        action={<Link href={`/${locale}/market/produce/${listingId}/edit`}><Button>Edit produce</Button></Link>}
        accent={<StatusPill tone="green">{listing.status}</StatusPill>}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <DetailSection title="Listing overview">
          <div className="space-y-4">
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Quantity</p><p className="mt-2 text-lg font-semibold text-ink">{listing.quantity} {listing.unit}</p></div>
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Expiry</p><p className="mt-2 text-lg font-semibold text-ink">{formatDateTime(listing.expiresAt)}</p></div>
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Price</p><p className="mt-2 text-lg font-semibold text-ink">{listing.pricePerUnit ? `${listing.pricePerUnit} per ${listing.unit}` : 'Negotiable / not listed'}</p></div>
          </div>
        </DetailSection>
        <DetailSection title="Contact & notes">
          <div className="space-y-4">
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Contact</p><p className="mt-2 text-lg font-semibold text-ink">{listing.contactName || 'Direct seller contact'} · {listing.contactPhone}</p></div>
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Description</p><p className="mt-2 text-sm leading-7 text-muted">{listing.description || 'No additional description provided.'}</p></div>
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
