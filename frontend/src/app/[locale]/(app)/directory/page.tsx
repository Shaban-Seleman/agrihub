import Link from 'next/link';
import { getDirectorySummary, listDirectory } from '@/api/directory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/presentation';

export default async function DirectoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, directory] = await Promise.all([getDirectorySummary(), listDirectory()]);
  return (
    <div className="space-y-5">
      <Card className="space-y-4"><Badge>SME directory</Badge><h1 className="text-3xl font-bold">Verified business ecosystem</h1><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Businesses listed</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.totalBusinesses ?? 0)}</p></div><div className="rounded-2xl bg-cream p-4"><p className="text-sm text-ink/60">Verified businesses</p><p className="mt-2 text-3xl font-bold">{formatNumber(summary.verifiedBusinesses ?? 0)}</p></div></div></Card>
      {directory.items?.map((item: any) => (
        <Link key={item.id} href={`/${locale}/directory/${item.id}`}>
          <Card className="space-y-3"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{item.businessName}</h2><Badge>{item.verificationStatus}</Badge></div><p className="text-sm text-black/70">{item.businessType}</p><p className="text-sm text-ink/70">{item.visibleInDirectory ? 'Visible in public directory' : 'Not yet public'}</p></Card>
        </Link>
      ))}
    </div>
  );
}
