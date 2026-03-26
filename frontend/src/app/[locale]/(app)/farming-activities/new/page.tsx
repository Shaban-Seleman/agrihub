import { FarmingForm } from '@/features/farming/farming-form';

export default async function NewFarmingActivityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FarmingForm locale={locale} mode="create" />;
}
