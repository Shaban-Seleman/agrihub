import { getOpportunity } from '@/api/opportunities';
import { OpportunityForm } from '@/features/opportunities/opportunity-form';

export default async function EditOpportunityPage({ params }: { params: Promise<{ locale: string; opportunityId: string }> }) {
  const { locale, opportunityId } = await params;
  const opportunity = await getOpportunity(opportunityId);
  return <OpportunityForm locale={locale} opportunityId={opportunityId} initialValues={opportunity} />;
}
