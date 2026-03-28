import Link from 'next/link';
import { getAdvisoryRecommendations, getAdvisorySummary, listAdvisory } from '@/api/advisory';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { StatusPill } from '@/components/app/primitives';
import { StatCard } from '@/components/app/cards';
import { formatNumber } from '@/lib/presentation';

export default async function AdvisoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, items, recommendations] = await Promise.all([getAdvisorySummary(), listAdvisory(), getAdvisoryRecommendations()]);
  return (
    <div className="space-y-8">
      <HeroPanel eyebrow="Extension and advisory" title="Published advisory guidance" subtitle="Browse advisory content shaped for crop, field, and agribusiness decision-making." />
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Published items" value={formatNumber(summary.publishedAdvisoryItems ?? 0)} hint="Live advisory items available to authenticated users." icon="article" />
        <div className="rounded-[2rem] bg-white p-6 shadow-card">
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">Recommended for your profile</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(recommendations ?? []).map((item: any) => <StatusPill key={item.id} tone="green">{item.title}</StatusPill>)}
          </div>
        </div>
      </div>
      <section className="space-y-5">
        <SectionHeader eyebrow="Advisory library" title="Current guidance" subtitle="Published advisory content in the same premium reading system used across learning and market flows." />
        <div className="grid gap-5 md:grid-cols-2">
          {items.items?.map((item: any) => (
            <Link key={item.id} href={`/${locale}/advisory/${item.id}`} className="rounded-[2rem] bg-white p-6 shadow-card">
              <div className="flex flex-wrap gap-2">
                <StatusPill tone="gold">{item.status}</StatusPill>
                {item.cropName ? <StatusPill tone="green">{item.cropName}</StatusPill> : null}
              </div>
              <h2 className="mt-4 font-headline text-3xl font-bold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
