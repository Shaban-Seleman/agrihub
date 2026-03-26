import Link from 'next/link';
import { getActivity } from '@/api/farming';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/presentation';

export default async function FarmingActivityDetailPage({
  params
}: {
  params: Promise<{ locale: string; activityId: string }>;
}) {
  const { locale, activityId } = await params;
  const activity = await getActivity(activityId);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{activity.cropName}</h1>
            <p className="mt-2 text-sm text-ink/70">{activity.seasonCode}</p>
          </div>
          <Badge>{activity.status}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Planting date</p><p className="mt-2 font-semibold">{formatDate(activity.plantingDate)}</p></div>
          <div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Harvest date</p><p className="mt-2 font-semibold">{formatDate(activity.harvestDate)}</p></div>
          <div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Land use</p><p className="mt-2 font-semibold">{activity.landSize} {activity.landUnit}</p></div>
          <div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Yield</p><p className="mt-2 font-semibold">{activity.actualYield ?? 'Not set'} {activity.yieldUnit ?? ''}</p></div>
        </div>
        <div className="rounded-2xl border border-black/10 p-4">
          <p className="text-sm font-semibold">Method and notes</p>
          <p className="mt-2 text-sm text-ink/75">{activity.farmingMethod}</p>
          <p className="mt-3 text-sm text-ink/70">{activity.notes || 'No notes recorded yet.'}</p>
        </div>
        <Link href={`/${locale}/farming-activities/${activityId}/edit`}><Button>Edit Activity</Button></Link>
      </Card>
    </div>
  );
}
