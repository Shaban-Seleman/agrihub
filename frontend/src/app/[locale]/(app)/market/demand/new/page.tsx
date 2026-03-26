import { DemandForm } from '@/features/market/market-forms';

export default async function NewDemandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DemandForm locale={locale} />;
}
