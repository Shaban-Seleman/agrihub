import { adminBusinesses } from '@/api/directory';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { ModerationActionBar, StatusPill } from '@/components/app/primitives';
import { Card } from '@/components/ui/card';
import { BusinessVerificationControl } from '@/features/admin/moderation-actions';
import { formatNumber } from '@/lib/presentation';

export default async function AdminBusinessesPage() {
  const businesses = await adminBusinesses();
  const items = (businesses.items ?? []) as any[];
  const verified = items.filter((business) => business.verificationStatus === 'VERIFIED').length;
  const pending = items.filter((business) => business.verificationStatus === 'PENDING').length;
  const rejected = items.filter((business) => business.verificationStatus === 'REJECTED').length;

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Admin verification</StatusPill>}
        title="Business verification"
        subtitle="Approve directory visibility only after the record is complete, credible, and safe for public listing."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Total profiles" value={formatNumber(items.length)} icon="apartment" />
        <CompactMetricCard label="Pending review" value={formatNumber(pending)} icon="pending_actions" tone="sand" />
        <CompactMetricCard label="Verified" value={formatNumber(verified)} icon="verified" />
        <CompactMetricCard label="Rejected" value={formatNumber(rejected)} icon="gpp_bad" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Verification queue"
          title="Directory business records"
          subtitle="Use the action area in each card to update verification status without exposing unsupported admin functionality."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((business) => (
            <Card key={business.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <h2 className="font-headline text-3xl font-bold text-ink">{business.businessName}</h2>
                  <p className="mt-2 text-sm text-muted">{business.businessType}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {(business.regionName || business.districtName) ? `${business.regionName ?? ''}${business.regionName && business.districtName ? ' · ' : ''}${business.districtName ?? ''}` : 'Location not provided yet'}
                  </p>
                </div>
                <StatusPill tone={business.verificationStatus === 'VERIFIED' ? 'green' : business.verificationStatus === 'REJECTED' ? 'gold' : 'muted'}>
                  {business.verificationStatus}
                </StatusPill>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Type</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{business.businessType}</p>
                </div>
                <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Phone</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{business.phoneNumber || 'Not provided'}</p>
                </div>
                <div className="rounded-[1.4rem] bg-sand px-4 py-3">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Commodities</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{business.commodityNames?.length ? business.commodityNames.join(', ') : 'Not set'}</p>
                </div>
              </div>
              <ModerationActionBar>
                <BusinessVerificationControl businessId={business.id} initialStatus={business.verificationStatus} />
              </ModerationActionBar>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
