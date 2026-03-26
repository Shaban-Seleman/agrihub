'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { archiveAdvisory, saveAdvisory } from '@/api/advisory-client';
import { updateBusinessVerification } from '@/api/directory-client';
import { archiveCourse, saveCourse } from '@/api/learning-client';
import { moderateDemand, moderateProduce } from '@/api/market-client';
import { moderateOpportunity } from '@/api/opportunities-client';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

function ActionStatus({
  error,
  success
}: {
  error: string | null;
  success: string | null;
}) {
  if (error) {
    return <p className="text-xs text-red-600">{error}</p>;
  }

  if (success) {
    return <p className="text-xs text-leaf">{success}</p>;
  }

  return null;
}

export function BusinessVerificationControl({
  businessId,
  initialStatus
}: {
  businessId: number;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || 'PENDING');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-40">
          {['PENDING', 'VERIFIED', 'REJECTED'].map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await updateBusinessVerification(businessId, status);
              setSuccess('Verification updated');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update verification');
            }
          }}
        >
          Save
        </Button>
      </div>
      <ActionStatus error={error} success={success} />
    </div>
  );
}

export function ListingModerationControl({
  listingId,
  initialStatus,
  kind
}: {
  listingId: number;
  initialStatus: string;
  kind: 'produce' | 'demand';
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || 'ACTIVE');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const save = async () => {
    if (kind === 'produce') {
      await moderateProduce(listingId, status);
      return;
    }

    await moderateDemand(listingId, status);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-40">
          {['ACTIVE', 'MODERATED', 'INACTIVE', 'EXPIRED'].map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await save();
              setSuccess('Listing moderation updated');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update listing');
            }
          }}
        >
          Apply
        </Button>
      </div>
      <ActionStatus error={error} success={success} />
    </div>
  );
}

export function OpportunityModerationControl({
  opportunityId,
  initialStatus
}: {
  opportunityId: number;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || 'ACTIVE');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-40">
          {['ACTIVE', 'MODERATED', 'INACTIVE', 'EXPIRED'].map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await moderateOpportunity(opportunityId, status);
              setSuccess('Opportunity moderation updated');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update opportunity');
            }
          }}
        >
          Apply
        </Button>
      </div>
      <ActionStatus error={error} success={success} />
    </div>
  );
}

export function CourseStatusControl({
  course
}: {
  course: { id: number; title: string; summary?: string | null; coverImageUrl?: string | null; status: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(course.status || 'DRAFT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-40">
          {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await saveCourse(course.id, {
                title: course.title,
                summary: course.summary ?? '',
                coverImageUrl: course.coverImageUrl ?? '',
                status
              });
              setSuccess('Course status updated');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update course');
            }
          }}
        >
          Save Status
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await archiveCourse(course.id);
              setStatus('ARCHIVED');
              setSuccess('Course archived');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to archive course');
            }
          }}
        >
          Archive
        </Button>
      </div>
      <ActionStatus error={error} success={success} />
    </div>
  );
}

export function AdvisoryStatusControl({
  advisory
}: {
  advisory: {
    id: number;
    title: string;
    summary: string;
    content: string;
    cropId?: number | null;
    regionId?: number | null;
    mediaUrl?: string | null;
    status: string;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(advisory.status || 'DRAFT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-40">
          {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await saveAdvisory(String(advisory.id), {
                title: advisory.title,
                summary: advisory.summary,
                content: advisory.content,
                cropId: advisory.cropId ?? null,
                regionId: advisory.regionId ?? null,
                mediaUrl: advisory.mediaUrl ?? null,
                status
              });
              setSuccess('Advisory status updated');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update advisory');
            }
          }}
        >
          Save Status
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await archiveAdvisory(advisory.id);
              setStatus('ARCHIVED');
              setSuccess('Advisory archived');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to archive advisory');
            }
          }}
        >
          Archive
        </Button>
      </div>
      <ActionStatus error={error} success={success} />
    </div>
  );
}
