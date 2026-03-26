import { getDonorOverview } from '@/api/dashboard';
import { Card } from '@/components/ui/card';
export default async function DonorOverviewPage() { const data = await getDonorOverview(); return <Card><h1 className="text-2xl font-bold">Donor Overview</h1><pre className="mt-4 text-sm">{JSON.stringify(data, null, 2)}</pre></Card>; }
