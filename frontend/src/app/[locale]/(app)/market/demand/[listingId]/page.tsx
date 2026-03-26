import Link from 'next/link';
import { getDemandListing } from '@/api/market';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/presentation';

export default async function DemandDetailPage({ params }: { params: Promise<{ locale: string; listingId: string }> }) {
  const { locale, listingId } = await params;
  const listing = await getDemandListing(listingId);
  return <Card className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">{listing.title}</h1><p className="mt-2 text-sm text-ink/70">{listing.cropName}</p></div><Badge>{listing.status}</Badge></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Quantity needed</p><p className="mt-2 font-semibold">{listing.quantity} {listing.unit}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Deadline</p><p className="mt-2 font-semibold">{formatDateTime(listing.expiresAt)}</p></div></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Description</p><p className="mt-2 text-sm text-ink/75">{listing.description || 'No additional description provided.'}</p></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Offered price</p><p className="mt-2 text-sm text-ink/75">{listing.offeredPricePerUnit ? `${listing.offeredPricePerUnit} per ${listing.unit}` : 'Open for negotiation'}</p></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Contact</p><p className="mt-2 text-sm text-ink/75">{listing.contactName || 'Buyer contact'} · {listing.contactPhone}</p></div></div><Link href={`/${locale}/market/demand/${listingId}/edit`}><Button className="mt-2">Edit Demand</Button></Link></Card>;
}
