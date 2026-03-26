import { adminOpportunities } from '@/api/opportunities';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { OpportunityModerationControl } from '@/features/admin/moderation-actions';

export default async function AdminOpportunitiesPage() {
  const opportunities = await adminOpportunities();
  return (
    <div className="space-y-4">
      <Card><h1 className="text-2xl font-bold">Opportunities moderation</h1><p className="mt-2 text-sm text-ink/70">Confirm deadlines and external application details before records remain publicly active.</p></Card>
      {opportunities.items?.map((opportunity: any) => (
        <Card key={opportunity.id} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold">{opportunity.title}</h2><p className="mt-1 text-sm text-ink/70">{opportunity.opportunityType}</p></div>
            <Badge>{opportunity.status}</Badge>
          </div>
          <OpportunityModerationControl opportunityId={opportunity.id} initialStatus={opportunity.status} />
        </Card>
      ))}
    </div>
  );
}
