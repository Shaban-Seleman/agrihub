import { getDirectoryItem } from '@/api/directory';
import { DetailSection, StatusPill } from '@/components/app/primitives';

export default async function DirectoryDetailPage({ params }: { params: Promise<{ businessProfileId: string }> }) {
  const { businessProfileId } = await params;
  const item = await getDirectoryItem(businessProfileId);
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] editorial-gradient p-8 text-white shadow-float">
        <StatusPill tone="gold">{item.verificationStatus}</StatusPill>
        <h1 className="mt-5 font-headline text-5xl font-bold">{item.businessName}</h1>
        <p className="mt-3 text-base text-white/80">{item.businessType}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <DetailSection title="Registration" subtitle="Core identity and directory visibility information.">
          <div className="space-y-4">
            <div className="rounded-[1.4rem] bg-sand p-4">
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Registration number</p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.registrationNumber || 'Not provided'}</p>
            </div>
            <div className="rounded-[1.4rem] bg-sand p-4">
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Directory visibility</p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.visibleInDirectory ? 'Visible' : 'Not visible'}</p>
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Commodities" subtitle="Commodities attached to this business profile.">
          <div className="flex flex-wrap gap-2">
            {(item.commodities ?? []).map((commodity: any) => (
              <StatusPill key={commodity.cropId} tone="green">
                {commodity.cropName}
              </StatusPill>
            ))}
          </div>
        </DetailSection>
      </div>
    </div>
  );
}
