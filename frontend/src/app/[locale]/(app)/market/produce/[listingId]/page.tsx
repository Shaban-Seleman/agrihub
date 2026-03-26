import Link from 'next/link';
import { getProduceListing } from '@/api/market';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/presentation';

export default async function ProduceDetailPage({ params }: { params: Promise<{ locale: string; listingId: string }> }) {
  const { locale, listingId } = await params;
  const listing = await getProduceListing(listingId);
  return <Card className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">{listing.title}</h1><p className="mt-2 text-sm text-ink/70">{listing.cropName}</p></div><Badge>{listing.status}</Badge></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Quantity</p><p className="mt-2 font-semibold">{listing.quantity} {listing.unit}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Expiry</p><p className="mt-2 font-semibold">{formatDateTime(listing.expiresAt)}</p></div></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Description</p><p className="mt-2 text-sm text-ink/75">{listing.description || 'No additional description provided.'}</p></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Price</p><p className="mt-2 text-sm text-ink/75">{listing.pricePerUnit ? `${listing.pricePerUnit} per ${listing.unit}` : 'Negotiable / not listed'}</p></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Contact</p><p className="mt-2 text-sm text-ink/75">{listing.contactName || 'Direct seller contact'} · {listing.contactPhone}</p></div></div><Link href={`/${locale}/market/produce/${listingId}/edit`}><Button className="mt-2">Edit Produce</Button></Link></Card>;
}
