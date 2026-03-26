import { getDemandListing } from '@/api/market';
import { DemandForm } from '@/features/market/market-forms';

export default async function EditDemandPage({ params }: { params: Promise<{ locale: string; listingId: string }> }) {
  const { locale, listingId } = await params;
  const listing = await getDemandListing(listingId);
  return <DemandForm locale={locale} listingId={listingId} initialValues={listing} />;
}
