import Link from 'next/link';
import { getDemandListing } from '@/api/market';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { HeroPanel } from '@/components/app/layout';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/presentation';

export default async function DemandDetailPage({ params }: { params: Promise<{ locale: string; listingId: string }> }) {
  const { locale, listingId } = await params;
  const listing = await getDemandListing(listingId);
  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="Demand listing"
        title={listing.title}
        subtitle={listing.cropName}
        action={<Link href={`/${locale}/market/demand/${listingId}/edit`}><Button>Edit demand</Button></Link>}
        accent={<StatusPill tone="gold">{listing.status}</StatusPill>}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <DetailSection title="Demand overview">
          <div className="space-y-4">
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Quantity needed</p><p className="mt-2 text-lg font-semibold text-ink">{listing.quantity} {listing.unit}</p></div>
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Deadline</p><p className="mt-2 text-lg font-semibold text-ink">{formatDateTime(listing.expiresAt)}</p></div>
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Offered price</p><p className="mt-2 text-lg font-semibold text-ink">{listing.offeredPricePerUnit ? `${listing.offeredPricePerUnit} per ${listing.unit}` : 'Open for negotiation'}</p></div>
          </div>
        </DetailSection>
        <DetailSection title="Buyer contact">
          <div className="space-y-4">
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Contact</p><p className="mt-2 text-lg font-semibold text-ink">{listing.contactName || 'Buyer contact'} · {listing.contactPhone}</p></div>
            <div className="rounded-[1.4rem] bg-sand p-4"><p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Description</p><p className="mt-2 text-sm leading-7 text-muted">{listing.description || 'No additional description provided.'}</p></div>
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
