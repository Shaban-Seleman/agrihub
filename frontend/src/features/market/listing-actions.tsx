'use client';

import { useRouter } from 'next/navigation';
import { deactivateDemand, deactivateProduce } from '@/api/market-client';
import { ConfirmActionButton } from '@/components/app/confirm-action';

export function DeactivateListingAction({
  listingId,
  kind,
  redirectTo
}: {
  listingId: string | number;
  kind: 'produce' | 'demand';
  redirectTo?: string;
}) {
  const router = useRouter();

  return (
    <ConfirmActionButton
      triggerLabel="Deactivate"
      title={`Deactivate this ${kind} listing?`}
      description="The listing will stop appearing as active in the market hub, but its reporting history will be preserved."
      confirmLabel="Deactivate listing"
      confirmVariant="secondary"
      successMessage="Listing deactivated"
      onConfirm={async () => {
        if (kind === 'produce') {
          await deactivateProduce(listingId);
        } else {
          await deactivateDemand(listingId);
        }

        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          router.refresh();
        }
      }}
    />
  );
}
