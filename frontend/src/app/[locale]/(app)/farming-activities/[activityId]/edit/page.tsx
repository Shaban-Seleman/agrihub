import { getActivity } from '@/api/farming';
import { ActivityWizard } from '@/features/farming/activity-wizard';

export default async function EditFarmingActivityPage({
  params
}: {
  params: Promise<{ locale: string; activityId: string }>;
}) {
  const { locale, activityId } = await params;
  const activity = await getActivity(activityId);
  return <ActivityWizard locale={locale} mode="edit" activityId={activityId} initialValues={activity} />;
}
