import { adminBusinesses } from '@/api/directory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BusinessVerificationControl } from '@/features/admin/moderation-actions';

export default async function AdminBusinessesPage() {
  const businesses = await adminBusinesses();
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold">Business verification</h1>
        <p className="mt-2 text-sm text-ink/70">Approve directory visibility only after the record is complete and safe for public listing.</p>
      </Card>
      {businesses.items?.map((business: any) => (
        <Card key={business.id} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">{business.businessName}</h2>
              <p className="mt-1 text-sm text-ink/70">{business.businessType}</p>
            </div>
            <Badge>{business.verificationStatus}</Badge>
          </div>
          <BusinessVerificationControl businessId={business.id} initialStatus={business.verificationStatus} />
        </Card>
      ))}
    </div>
  );
}
