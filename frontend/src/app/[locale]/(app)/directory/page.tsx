import Link from 'next/link';
import { getDirectorySummary, listDirectory } from '@/api/directory';
import { DirectoryCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { FilterChip } from '@/components/app/primitives';
import { formatNumber } from '@/lib/presentation';

export default async function DirectoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, directory] = await Promise.all([getDirectorySummary(), listDirectory()]);
  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="SME directory"
        title={
          <>
            Verified business
            <br />
            <span className="italic text-soil">ecosystem</span>
          </>
        }
        subtitle="Browse agribusiness SMEs and directory-ready enterprises connected to crops, services, and market opportunities."
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active>Verified</FilterChip>
        <FilterChip>Processors</FilterChip>
        <FilterChip>Aggregators</FilterChip>
        <FilterChip>Input suppliers</FilterChip>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Businesses listed" value={formatNumber(summary.totalBusinesses ?? 0)} hint="Total visible business profiles in the directory." icon="domain" />
        <StatCard label="Verified businesses" value={formatNumber(summary.verifiedBusinesses ?? 0)} hint="Profiles with active verification status." icon="verified" tone="gold" />
      </div>

      <section className="space-y-5">
        <SectionHeader eyebrow="Directory list" title="Business profiles" subtitle="Verified businesses with commodity, visibility, and profile details." />
        <div className="grid gap-5 md:grid-cols-2">
          {directory.items?.map((item: any) => (
            <DirectoryCard
              key={item.id}
              href={`/${locale}/directory/${item.id}`}
              title={item.businessName}
              type={item.businessType}
              verification={item.verificationStatus}
              description={item.visibleInDirectory ? 'Visible in the public directory.' : 'Business profile is not yet visible in the public directory.'}
              commodities={(item.commodities ?? []).map((commodity: any) => commodity.cropName)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
