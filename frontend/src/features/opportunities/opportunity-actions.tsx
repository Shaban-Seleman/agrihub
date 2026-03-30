'use client';

import { useRouter } from 'next/navigation';
import { deactivateOpportunity } from '@/api/opportunities-client';
import { ConfirmActionButton } from '@/components/app/confirm-action';

export function DeactivateOpportunityAction({
  opportunityId,
  redirectTo
}: {
  opportunityId: string | number;
  redirectTo?: string;
}) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      triggerLabel="Deactivate"
      title="Deactivate this opportunity?"
      description="The opportunity will no longer be available to new viewers, but its moderation and reporting record will remain intact."
      confirmLabel="Deactivate opportunity"
      confirmVariant="secondary"
      successMessage="Opportunity deactivated"
      onConfirm={async () => {
        await deactivateOpportunity(opportunityId);
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          router.refresh();
        }
      }}
    />
  );
}
