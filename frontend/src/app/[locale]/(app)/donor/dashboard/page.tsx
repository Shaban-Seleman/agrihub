import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const routes = ['overview', 'inclusion', 'production', 'market', 'opportunities', 'smes'];

export default async function DonorDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Card className="space-y-4">
      <Badge>Read-only donor view</Badge>
      <h1 className="text-2xl font-bold">Donor dashboard</h1>
      <p className="text-sm text-ink/70">Open aggregated program metrics only. No raw user records are exposed in this area.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {routes.map((route) => (
          <Link key={route} href={`/${locale}/donor/${route}`} className="rounded-xl border border-black/10 p-3 capitalize">
            {route}
          </Link>
        ))}
      </div>
    </Card>
  );
}
