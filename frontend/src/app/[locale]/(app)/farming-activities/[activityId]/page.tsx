import Link from 'next/link';
import { getActivity } from '@/api/farming';
import { HeroPanel } from '@/components/app/layout';
import { DetailRow, DetailSection, MediaPanel, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/presentation';

export default async function FarmingActivityDetailPage({
  params
}: {
  params: Promise<{ locale: string; activityId: string }>;
}) {
  const { locale, activityId } = await params;
  const activity = await getActivity(activityId);

  return (
    <div className="space-y-8">
      <MediaPanel
        title={`${activity.cropName} - ${activity.seasonCode}`}
        subtitle="A complete view of the season record, from planting details through harvest updates and field notes."
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDQqJe_571HAC031veK96_TiS5ZVydSoYho7Qv0aWbBKDtxrNuokuGzDMCf8il7A_njijHyQ1-E5WLu4hn0L32kStXn2b5g1bfo4Y-cnhni4prZXl9_ZJUkakHnkMZEMmLOgnv3Y5Purq54Sd53hc7I1wot8059EERgdUgn8vyEP814GcRoEvzssQRCCOD8jEOUtvyBVCIcHmvWfO1DyAIP14daI7umbaCmWZikCDKyP9j6FBJ6o5s1bysC9iSIAcgoO-Hf0_arzVM"
        badge={<StatusPill tone={activity.status === 'HARVESTED' ? 'gold' : 'green'}>{activity.status}</StatusPill>}
      >
        <Link href={`/${locale}/farming-activities/${activityId}/edit`}>
          <Button variant="secondary">Edit details</Button>
        </Link>
      </MediaPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HeroPanel eyebrow="Planting date" title={formatDate(activity.plantingDate)} accent={null} />
        <HeroPanel eyebrow="Harvest date" title={formatDate(activity.harvestDate)} accent={null} />
        <HeroPanel eyebrow="Land use" title={`${activity.landSize} ${activity.landUnit}`} accent={null} />
        <HeroPanel eyebrow="Yield" title={`${activity.actualYield ?? 'Not set'} ${activity.yieldUnit ?? ''}`.trim()} accent={null} />
      </div>

      <DetailSection title="Field record" subtitle="These details are used for progress tracking, reporting, and future season planning.">
        <DetailRow label="Season code" value={activity.seasonCode} icon="calendar_today" />
        <DetailRow label="Farming method" value={activity.farmingMethod} icon="eco" />
        <DetailRow label="Status" value={activity.status} icon="check_circle" />
        <DetailRow label="Recorded notes" value={activity.notes || 'No notes recorded yet.'} icon="note_stack" />
      </DetailSection>
    </div>
  );
}
