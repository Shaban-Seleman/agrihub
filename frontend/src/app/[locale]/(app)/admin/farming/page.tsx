import Link from 'next/link';
import { adminListActivities, getAdminFarmingSummary } from '@/api/farming';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { formatDate, formatNumber } from '@/lib/presentation';

export default async function AdminFarmingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, activities] = await Promise.all([getAdminFarmingSummary(), adminListActivities()]);
  const items = activities.items ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Admin farming</StatusPill>}
        title="Production records"
        subtitle="Review seasonal activity records that feed platform reporting and aggregated production analytics."
        action={
          <Link href={`/${locale}/admin/analytics`}>
            <Button variant="secondary">Back to analytics</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CompactMetricCard label="Tracked activities" value={formatNumber(summary.totalActivities ?? items.length)} icon="format_list_bulleted" />
        <CompactMetricCard label="Harvested" value={formatNumber(summary.harvestedActivities ?? 0)} icon="check_circle" />
        <CompactMetricCard label="Total yield" value={formatNumber(summary.totalYield ?? 0)} icon="agriculture" tone="sand" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Activity review"
          title="Recent farming records"
          subtitle="This admin view is read-only and intended for oversight, not direct field-data editing."
        />
        <div className="grid gap-4">
          {items.map((activity: any) => (
            <DetailSection
              key={activity.id}
              title={activity.cropName}
              subtitle={`${activity.seasonCode} · ${activity.farmingMethod}`}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.25rem] bg-sand p-4">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Status</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{activity.status}</p>
                </div>
                <div className="rounded-[1.25rem] bg-sand p-4">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Planting date</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{formatDate(activity.plantingDate)}</p>
                </div>
                <div className="rounded-[1.25rem] bg-sand p-4">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Land size</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{activity.landSize} {activity.landUnit}</p>
                </div>
                <div className="rounded-[1.25rem] bg-sand p-4">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Yield</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{activity.actualYield ?? 'Not set'} {activity.yieldUnit ?? ''}</p>
                </div>
              </div>
            </DetailSection>
          ))}
        </div>
      </section>
    </div>
  );
}
