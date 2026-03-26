import { Card } from '@/components/ui/card';

export default function AdminUsersPage() {
  return (
    <Card>
      <h1 className="text-2xl font-bold">Unsupported Route</h1>
      <p className="mt-3 text-sm text-black/70">
        This route is intentionally unsupported because the locked backend API contract does not expose `/api/v1/admin/users`. It has been removed from active admin navigation.
      </p>
    </Card>
  );
}
