import { adminAdvisory } from '@/api/advisory';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { ModerationActionBar, StatusPill } from '@/components/app/primitives';
import { Card } from '@/components/ui/card';
import { AdvisoryStatusControl } from '@/features/admin/moderation-actions';
import { formatNumber } from '@/lib/presentation';

export default async function AdminAdvisoryPage() {
  const advisory = await adminAdvisory();
  const items = (advisory.items ?? []) as any[];
  const drafts = items.filter((item) => item.status === 'DRAFT').length;
  const published = items.filter((item) => item.status === 'PUBLISHED').length;
  const archived = items.filter((item) => item.status === 'ARCHIVED').length;

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Admin advisory</StatusPill>}
        title="Advisory management"
        subtitle="Publish extension guidance only when it is clear, safe, and suitable for broad distribution across the platform."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Total items" value={formatNumber(items.length)} icon="article" />
        <CompactMetricCard label="Draft" value={formatNumber(drafts)} icon="draft_orders" tone="sand" />
        <CompactMetricCard label="Published" value={formatNumber(published)} icon="campaign" />
        <CompactMetricCard label="Archived" value={formatNumber(archived)} icon="inventory_2" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Publishing controls"
          title="Advisory records"
          subtitle="Archive or update published state directly from the action area on each advisory item."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <h2 className="font-headline text-3xl font-bold text-ink">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
                </div>
                <StatusPill tone={item.status === 'PUBLISHED' ? 'green' : item.status === 'ARCHIVED' ? 'gold' : 'muted'}>
                  {item.status}
                </StatusPill>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.cropName ? <StatusPill tone="muted">{item.cropName}</StatusPill> : null}
                {item.regionName ? <StatusPill tone="muted">{item.regionName}</StatusPill> : null}
              </div>
              <ModerationActionBar>
                <AdvisoryStatusControl advisory={item} />
              </ModerationActionBar>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
