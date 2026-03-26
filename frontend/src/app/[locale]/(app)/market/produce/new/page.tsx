import { ProduceForm } from '@/features/market/market-forms';

export default async function NewProducePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ProduceForm locale={locale} />;
}
