import { adminAdvisory } from '@/api/advisory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AdvisoryStatusControl } from '@/features/admin/moderation-actions';

export default async function AdminAdvisoryPage() {
  const advisory = await adminAdvisory();
  return (
    <div className="space-y-4">
      <Card><h1 className="text-2xl font-bold">Advisory management</h1><p className="mt-2 text-sm text-ink/70">Publish advisory only when the content is suitable for open guidance and safe for broad distribution.</p></Card>
      {advisory.items?.map((item: any) => (
        <Card key={item.id} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm text-ink/70">{item.summary}</p></div>
            <Badge>{item.status}</Badge>
          </div>
          <AdvisoryStatusControl advisory={item} />
        </Card>
      ))}
    </div>
  );
}
