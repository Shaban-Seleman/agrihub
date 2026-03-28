'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { completeLesson, saveLessonFeedback } from '@/api/learning-client';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

export function LessonActions({
  lessonId,
  previousHref,
  nextHref,
  initialFeedback,
  completed
}: {
  lessonId: string;
  previousHref?: string | null;
  nextHref?: string | null;
  initialFeedback?: { helpful?: boolean; comment?: string | null } | null;
  completed?: boolean;
}) {
  const router = useRouter();
  const [comment, setComment] = useState(initialFeedback?.comment ?? '');
  const [helpful, setHelpful] = useState<boolean | null>(
    typeof initialFeedback?.helpful === 'boolean' ? initialFeedback.helpful : null
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <DetailSection title="Lesson actions" subtitle="Move through the course in order and leave internal feedback to improve future curriculum quality." className="h-fit">
      <div className="space-y-2">
        <StatusPill tone={completed ? 'green' : 'gold'}>{completed ? 'Completed' : 'Ready to study'}</StatusPill>
      </div>
      {error ? <p className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <Button
          variant="ghost"
          disabled={!previousHref}
          onClick={() => previousHref && router.push(previousHref)}
          className="border border-black/10"
        >
          Previous
        </Button>
        <Button
          className="w-full"
          onClick={async () => {
            try {
              setError(null);
              setSaving(true);
              await completeLesson(lessonId);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to complete lesson');
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? 'Saving...' : completed ? 'Completed' : 'Mark Complete'}
        </Button>
        <Button
          variant="secondary"
          disabled={!nextHref}
          onClick={() => nextHref && router.push(nextHref)}
        >
          Next
        </Button>
      </div>
      <div className="space-y-3 rounded-[1.4rem] bg-cream p-4">
        <div>
          <h3 className="font-headline text-2xl font-bold text-ink">Was this lesson helpful?</h3>
          <p className="mt-1 text-sm text-ink/70">Your response is internal and helps the team improve the curriculum.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className={cn(
              'min-h-11 flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition',
              helpful === true ? 'border-leaf bg-leaf text-white' : 'border-black/10 bg-white text-ink hover:border-leaf/40'
            )}
            onClick={() => setHelpful(true)}
          >
            Yes, helpful
          </button>
          <button
            type="button"
            className={cn(
              'min-h-11 flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition',
              helpful === false ? 'border-ink bg-ink text-white' : 'border-black/10 bg-white text-ink hover:border-ink/40'
            )}
            onClick={() => setHelpful(false)}
          >
            Not yet
          </button>
        </div>
        <Textarea
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          variant="secondary"
          className="w-full"
          onClick={async () => {
            try {
              if (helpful === null) {
                setError('Select whether the lesson was helpful before saving feedback');
                return;
              }

              setError(null);
              setSaving(true);
              await saveLessonFeedback(lessonId, { helpful, comment: comment || undefined });
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to save feedback');
            } finally {
              setSaving(false);
            }
          }}
        >
          Save Feedback
        </Button>
      </div>
    </DetailSection>
  );
}
