import { OpportunityForm } from '@/features/opportunities/opportunity-form';

export default async function NewOpportunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OpportunityForm locale={locale} />;
}
