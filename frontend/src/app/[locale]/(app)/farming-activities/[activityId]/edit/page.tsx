import { getActivity } from '@/api/farming';
import { FarmingForm } from '@/features/farming/farming-form';

export default async function EditFarmingActivityPage({
  params
}: {
  params: Promise<{ locale: string; activityId: string }>;
}) {
  const { locale, activityId } = await params;
  const activity = await getActivity(activityId);
  return <FarmingForm locale={locale} mode="edit" activityId={activityId} initialValues={activity} />;
}
