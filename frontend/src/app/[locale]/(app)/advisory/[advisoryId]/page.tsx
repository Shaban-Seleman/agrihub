import { getAdvisory } from '@/api/advisory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function AdvisoryDetailPage({ params }: { params: Promise<{ advisoryId: string }> }) {
  const { advisoryId } = await params;
  const item = await getAdvisory(advisoryId);
  return <Card className="space-y-4"><div className="flex flex-wrap items-center gap-3"><Badge>{item.status}</Badge>{item.cropName ? <Badge>{item.cropName}</Badge> : null}</div><h1 className="text-3xl font-bold">{item.title}</h1><p className="text-sm text-ink/70">{item.summary}</p><div className="rounded-[1.4rem] bg-cream p-5"><div className="whitespace-pre-wrap text-sm leading-8 text-black/80">{item.content}</div></div></Card>;
}
