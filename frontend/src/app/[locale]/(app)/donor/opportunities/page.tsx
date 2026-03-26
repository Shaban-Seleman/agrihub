import { getDonorOpportunities } from '@/api/dashboard';
import { Card } from '@/components/ui/card';
export default async function DonorOpportunitiesPage() { const data = await getDonorOpportunities(); return <Card><h1 className="text-2xl font-bold">Donor Opportunities</h1><pre className="mt-4 text-sm">{JSON.stringify(data, null, 2)}</pre></Card>; }
