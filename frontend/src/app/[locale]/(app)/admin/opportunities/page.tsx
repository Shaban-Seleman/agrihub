import { adminOpportunities } from '@/api/opportunities';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { ModerationActionBar, StatusPill } from '@/components/app/primitives';
import { Card } from '@/components/ui/card';
import { OpportunityModerationControl } from '@/features/admin/moderation-actions';
import { formatDate, formatNumber } from '@/lib/presentation';

export default async function AdminOpportunitiesPage() {
  const opportunities = await adminOpportunities();
  const items = (opportunities.items ?? []) as any[];
  const active = items.filter((item) => item.status === 'ACTIVE').length;
  const moderated = items.filter((item) => item.status === 'MODERATED').length;
  const inactive = items.filter((item) => item.status === 'INACTIVE' || item.status === 'EXPIRED').length;

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Admin opportunities</StatusPill>}
        title="Opportunity moderation"
        subtitle="Keep deadlines, application links, and public visibility aligned with the current opportunity lifecycle."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Total notices" value={formatNumber(items.length)} icon="campaign" />
        <CompactMetricCard label="Active" value={formatNumber(active)} icon="rocket_launch" />
        <CompactMetricCard label="Moderated" value={formatNumber(moderated)} icon="policy" tone="sand" />
        <CompactMetricCard label="Closed" value={formatNumber(inactive)} icon="event_busy" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Moderation queue"
          title="Opportunity records"
          subtitle="Review the status of public opportunities without introducing applicant-tracking features outside the locked MVP."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((opportunity) => (
            <Card key={opportunity.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <h2 className="font-headline text-3xl font-bold text-ink">{opportunity.title}</h2>
                  <p className="mt-2 text-sm text-muted">{opportunity.opportunityType}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{opportunity.summary}</p>
                </div>
                <StatusPill tone={opportunity.status === 'ACTIVE' ? 'green' : opportunity.status === 'MODERATED' ? 'gold' : 'muted'}>
                  {opportunity.status}
                </StatusPill>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Deadline</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{formatDate(opportunity.deadline)}</p>
                </div>
                <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Region</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{opportunity.regionName || 'National'}</p>
                </div>
              </div>
              <ModerationActionBar>
                <OpportunityModerationControl opportunityId={opportunity.id} initialStatus={opportunity.status} />
              </ModerationActionBar>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
