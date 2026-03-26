import { getProduceListing } from '@/api/market';
import { ProduceForm } from '@/features/market/market-forms';

export default async function EditProducePage({ params }: { params: Promise<{ locale: string; listingId: string }> }) {
  const { locale, listingId } = await params;
  const listing = await getProduceListing(listingId);
  return <ProduceForm locale={locale} listingId={listingId} initialValues={listing} />;
}
