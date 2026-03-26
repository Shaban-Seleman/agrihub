import { getDirectoryItem } from '@/api/directory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function DirectoryDetailPage({ params }: { params: Promise<{ businessProfileId: string }> }) {
  const { businessProfileId } = await params;
  const item = await getDirectoryItem(businessProfileId);
  return <Card className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">{item.businessName}</h1><p className="mt-2 text-sm text-ink/70">{item.businessType}</p></div><Badge>{item.verificationStatus}</Badge></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Registration number</p><p className="mt-2 font-semibold">{item.registrationNumber || 'Not provided'}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Directory visibility</p><p className="mt-2 font-semibold">{item.visibleInDirectory ? 'Visible' : 'Not visible'}</p></div></div><div className="rounded-2xl border border-black/10 p-4"><p className="text-sm font-semibold">Commodities</p><div className="mt-3 flex flex-wrap gap-2">{(item.commodities ?? []).map((commodity: any) => <Badge key={commodity.cropId}>{commodity.cropName}</Badge>)}</div></div></Card>;
}
