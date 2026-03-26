import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getFarmingSummary, listMyActivities } from '@/api/farming';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { canAccessFarming, getRoleHomePath } from '@/lib/auth/navigation';
import { requireSession } from '@/lib/auth/session';
import { formatDate, formatNumber } from '@/lib/presentation';

export default async function FarmingActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession();

  if (!canAccessFarming(session.accountType)) {
    redirect(getRoleHomePath(locale, session.accountType));
  }

  const [activities, summary] = await Promise.all([listMyActivities(), getFarmingSummary()]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Badge>Value chain tracking</Badge>
          <h1 className="mt-2 text-3xl font-bold">Farming activities</h1>
        </div>
        <Link href={`/${locale}/farming-activities/new`}><Button>Add Activity</Button></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-ink/60">Tracked activities</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.totalActivities ?? activities.items?.length ?? 0)}</p></Card>
        <Card><p className="text-sm text-ink/60">Harvested</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.harvestedActivities ?? 0)}</p></Card>
        <Card><p className="text-sm text-ink/60">Reported output</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.totalYield ?? 0)}</p></Card>
      </div>
      {activities.items?.map((activity: any) => (
        <Link key={activity.id} href={`/${locale}/farming-activities/${activity.id}`}>
          <Card className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">{activity.cropName}</h2>
              <Badge>{activity.status}</Badge>
            </div>
            <p className="text-sm text-black/70">{activity.seasonCode}</p>
            <div className="grid gap-2 text-sm text-ink/70 sm:grid-cols-3">
              <span>Planted: {formatDate(activity.plantingDate)}</span>
              <span>Land: {activity.landSize} {activity.landUnit}</span>
              <span>Method: {activity.farmingMethod}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
