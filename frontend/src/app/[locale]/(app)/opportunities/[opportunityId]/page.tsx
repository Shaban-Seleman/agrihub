import Link from 'next/link';
import { getOpportunity, listMyOpportunities } from '@/api/opportunities';
import { DetailRow, DetailSection, MediaPanel, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { DeactivateOpportunityAction } from '@/features/opportunities/opportunity-actions';
import { requireSession } from '@/lib/auth/session';
import { formatDateTime, formatEnumLabel } from '@/lib/presentation';

export default async function OpportunityDetailPage({ params }: { params: Promise<{ locale: string; opportunityId: string }> }) {
  const { locale, opportunityId } = await params;
  const session = await requireSession();
  const opportunity = await getOpportunity(opportunityId);
  const canOwnOpportunities = ['AGRI_SME', 'PARTNER', 'ADMIN'].includes(session.accountType);
  const ownedOpportunityIds = canOwnOpportunities
    ? new Set(((await listMyOpportunities()).items ?? []).map((item: any) => String(item.id)))
    : new Set<string>();
  const isOwned = ownedOpportunityIds.has(String(opportunity.id));
  return (
    <div className="space-y-8">
      <MediaPanel
        title={opportunity.title}
        subtitle={opportunity.summary}
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCbxKfleTU4CukZqfhvKYWeKMlOY21OXqyy5UfllzgJ1Cy9BMTQDtRAstLCq5BgWlvQpQEt947TQvd3fGYanNSWggWR2ZXFZLOvwfW0xokpz7REEV0VRbiM0zQbGwqjcKWSZ-hdpNAdX8K7w52FX-K8TtwgQVUhIgO00ttT7WW-D3-Cu5qeothpgJpu-X-tR-TZQwON5lRNBb7UKIdOqMRQdHUxwRjFg9HPeUxe4aNbXtje_sYhIlX_xE1z-wKNhzy5702M7DBvDqY"
        badge={<StatusPill tone="gold">{opportunity.status}</StatusPill>}
      >
        <div className="flex flex-wrap gap-3">
          <StatusPill tone="green">{formatEnumLabel(opportunity.opportunityType)}</StatusPill>
          <StatusPill tone="muted">{formatDateTime(opportunity.deadline)}</StatusPill>
        </div>
      </MediaPanel>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <DetailSection title="Program overview" subtitle="A clean summary of the opportunity scope and its application path.">
          <p className="text-base leading-8 text-muted">{opportunity.summary}</p>
        </DetailSection>

        <DetailSection title="Key details">
          <DetailRow label="Opportunity type" value={formatEnumLabel(opportunity.opportunityType)} icon="category" />
          <DetailRow label="Deadline" value={formatDateTime(opportunity.deadline)} icon="calendar_month" />
          <DetailRow label="Geography" value={opportunity.regionName || 'Not specified'} icon="location_on" />
        </DetailSection>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DetailSection title="External application" subtitle="Application remains external in this MVP.">
          <p className="text-sm leading-7 text-muted">{opportunity.externalApplicationLink || 'Not provided'}</p>
        </DetailSection>
        <DetailSection title="Contact details" subtitle="Use contact details when no external application link is provided.">
          <p className="text-sm leading-7 text-muted">{opportunity.contactDetails || 'Not provided'}</p>
        </DetailSection>
      </div>

      {isOwned ? (
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/opportunities/${opportunityId}/edit`}><Button>Edit opportunity</Button></Link>
          <DeactivateOpportunityAction opportunityId={opportunityId} redirectTo={`/${locale}/opportunities`} />
        </div>
      ) : null}
    </div>
  );
}
