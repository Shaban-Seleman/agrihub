'use client';

import { useRouter } from 'next/navigation';
import { deleteActivity } from '@/api/farming-client';
import { ConfirmActionButton } from '@/components/app/confirm-action';

export function DeleteActivityAction({
  activityId,
  redirectTo
}: {
  activityId: string | number;
  redirectTo?: string;
}) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      triggerLabel="Delete"
      title="Delete this activity?"
      description="This will remove the farming record from your activity history. Use this only if the entry was created in error."
      confirmLabel="Delete activity"
      confirmVariant="secondary"
      successMessage="Activity deleted"
      onConfirm={async () => {
        await deleteActivity(String(activityId));
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          router.refresh();
        }
      }}
    />
  );
}
