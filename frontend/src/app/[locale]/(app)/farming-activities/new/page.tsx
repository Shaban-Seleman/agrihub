import { ActivityWizard } from '@/features/farming/activity-wizard';

export default async function NewFarmingActivityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ActivityWizard locale={locale} mode="create" />;
}
