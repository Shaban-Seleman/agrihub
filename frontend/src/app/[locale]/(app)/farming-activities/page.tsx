import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getFarmingSummary, listMyActivities } from '@/api/farming';
import { ActivityCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { Icon, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Value chain tracking"
        title={
          <>
            Farming
            <br />
            <span className="italic text-soil">activities</span>
          </>
        }
        subtitle="Track the season from planting to harvest with structured records that stay useful for your own planning and for aggregated reporting."
        action={
          <Link href={`/${locale}/farming-activities/new`}>
            <Button>Add activity</Button>
          </Link>
        }
        accent={
          <div className="rounded-[2rem] bg-leaf p-5 text-white shadow-float">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Harvested</p>
            <p className="mt-3 font-headline text-5xl font-bold">{formatNumber(summary.harvestedActivities ?? 0)}</p>
            <p className="mt-2 text-sm text-white/75">Activities with recorded harvest outcomes.</p>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Tracked activities" value={formatNumber(summary.totalActivities ?? activities.items?.length ?? 0)} hint="All seasonal records you have logged." icon="format_list_bulleted" />
        <StatCard label="Harvested" value={formatNumber(summary.harvestedActivities ?? 0)} hint="Activities updated with harvest data." icon="check_circle" />
        <StatCard label="Reported output" value={formatNumber(summary.totalYield ?? 0)} hint="Combined yield reported so far." icon="bar_chart" tone="gold" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Field records"
          title="Your activity list"
          subtitle="Each card captures the crop, season, planting date, and current production status."
        />
        <div className="grid gap-5">
          {activities.items?.map((activity: any) => (
            <ActivityCard
              key={activity.id}
              href={`/${locale}/farming-activities/${activity.id}`}
              title={activity.cropName}
              subtitle={activity.seasonCode}
              badge={<StatusPill tone={activity.status === 'HARVESTED' ? 'gold' : 'green'}>{activity.status}</StatusPill>}
              meta={[
                `Planted ${formatDate(activity.plantingDate)}`,
                `Land ${activity.landSize} ${activity.landUnit}`,
                activity.farmingMethod
              ]}
              accent={<Icon name="eco" className="text-[26px] text-leaf" filled />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
