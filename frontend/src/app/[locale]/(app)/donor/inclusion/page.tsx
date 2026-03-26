import { getDonorInclusion } from '@/api/dashboard';
import { Card } from '@/components/ui/card';
export default async function DonorInclusionPage() { const data = await getDonorInclusion(); return <Card><h1 className="text-2xl font-bold">Donor Inclusion</h1><pre className="mt-4 text-sm">{JSON.stringify(data, null, 2)}</pre></Card>; }
