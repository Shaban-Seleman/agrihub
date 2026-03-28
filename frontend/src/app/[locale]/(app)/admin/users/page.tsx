import { PageHeader } from '@/components/app/layout';
import { DetailSection, StatusPill } from '@/components/app/primitives';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="gold">Unsupported</StatusPill>}
        title="Admin users is not available"
        subtitle="This route remains outside the locked MVP because the backend contract does not expose `/api/v1/admin/users`."
      />
      <DetailSection
        title="Why this route is disabled"
        subtitle="The page stays present only as an explicit unsupported state. It is removed from active admin navigation and does not simulate missing backend functionality."
      >
        <p className="text-sm leading-7 text-muted">
          If user administration is needed later, it should be added only after the backend API contract is formally expanded and approved.
        </p>
      </DetailSection>
    </div>
  );
}
