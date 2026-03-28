import Link from 'next/link';
import { getOpportunitySummary, listOpportunities } from '@/api/opportunities';
import { OpportunityCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { FilterChip } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatEnumLabel, formatNumber } from '@/lib/presentation';

export default async function OpportunitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [summary, opportunities] = await Promise.all([getOpportunitySummary(), listOpportunities()]);
  const items = opportunities.items ?? [];
  const featured = items[0] ?? null;

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Institutional opportunities"
        title={
          <>
            Available
            <br />
            <span className="italic text-soil">opportunities</span>
          </>
        }
        subtitle="Browse grants, training, and market-facing openings that can accelerate agribusiness participation."
        action={
          <Link href={`/${locale}/opportunities/new`}>
            <Button>Create opportunity</Button>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active>All</FilterChip>
        <FilterChip>Grants</FilterChip>
        <FilterChip>Training</FilterChip>
        <FilterChip>Markets</FilterChip>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Open opportunities" value={formatNumber(summary.activeOpportunities ?? 0)} hint="Current opportunities visible to eligible users." icon="rocket_launch" />
      </div>

      {featured ? (
        <OpportunityCard
          href={`/${locale}/opportunities/${featured.id}`}
          title={featured.title}
          type={formatEnumLabel(featured.opportunityType)}
          deadline={formatDateTime(featured.deadline)}
          region={featured.regionName || 'Tanzania'}
          summary={featured.summary}
          featured
        />
      ) : null}

      <section className="space-y-5">
        <SectionHeader eyebrow="Opportunity list" title="More openings" subtitle="Structured opportunities from SMEs, partners, and institutions." />
        <div className="grid gap-5 md:grid-cols-2">
          {items.slice(featured ? 1 : 0).map((opportunity: any) => (
            <OpportunityCard
              key={opportunity.id}
              href={`/${locale}/opportunities/${opportunity.id}`}
              title={opportunity.title}
              type={formatEnumLabel(opportunity.opportunityType)}
              deadline={formatDateTime(opportunity.deadline)}
              region={opportunity.regionName || 'Multiple regions'}
              summary={opportunity.summary}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
