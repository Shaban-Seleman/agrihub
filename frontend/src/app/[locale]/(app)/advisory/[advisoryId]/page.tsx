import { getAdvisory } from '@/api/advisory';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { HeroPanel } from '@/components/app/layout';

export default async function AdvisoryDetailPage({ params }: { params: Promise<{ locale: string; advisoryId: string }> }) {
  const { advisoryId } = await params;
  const item = await getAdvisory(advisoryId);
  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="Advisory detail"
        title={item.title}
        subtitle={item.summary}
        accent={
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="gold">{item.status}</StatusPill>
            {item.cropName ? <StatusPill tone="green">{item.cropName}</StatusPill> : null}
          </div>
        }
      />
      <DetailSection title="Guidance body" subtitle="Readable advisory content in a mobile-first content block.">
        <div className="whitespace-pre-wrap text-sm leading-8 text-black/80">{item.content}</div>
      </DetailSection>
    </div>
  );
}
