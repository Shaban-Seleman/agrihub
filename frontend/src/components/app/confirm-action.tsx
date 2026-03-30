'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ConfirmActionButton({
  triggerLabel,
  title,
  description,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  successMessage,
  className
}: {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  onConfirm: () => Promise<void>;
  successMessage?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={className}
        onClick={() => {
          setError(null);
          setSuccess(null);
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>

      {success ? <p className="text-xs text-leaf">{success}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/45 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-float">
            <h3 className="font-headline text-3xl font-bold text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={confirmVariant}
                className={confirmVariant === 'secondary' ? 'text-red-700' : undefined}
                disabled={submitting}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    setError(null);
                    await onConfirm();
                    setSuccess(successMessage ?? `${confirmLabel} complete`);
                    setOpen(false);
                  } catch (cause) {
                    setError(cause instanceof Error ? cause.message : 'Action failed');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {submitting ? 'Working...' : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
