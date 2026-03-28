import Link from 'next/link';
import { getProfileBundle, getProfileCompletion } from '@/api/profile';
import { listMyOpportunities, listOpportunities } from '@/api/opportunities';
import { getAdvisorySummary } from '@/api/advisory';
import { ActionCard, StatCard } from '@/components/app/cards';
import { HeroPanel } from '@/components/app/layout';
import { requireSession } from '@/lib/auth/session';
import { formatNumber } from '@/lib/presentation';

export default async function PartnerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireSession(['PARTNER']);
  const [profileBundle, completion, myOpportunities, allOpportunities, advisorySummary] = await Promise.all([
    getProfileBundle(),
    getProfileCompletion(),
    listMyOpportunities(),
    listOpportunities(),
    getAdvisorySummary()
  ]);

  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="Partner dashboard"
        title={profileBundle.roleProfile?.organizationName || 'Partner workspace'}
        subtitle="Manage institutional participation, publish opportunities, and monitor ecosystem knowledge resources from a clean partner-facing workspace."
        accent={<StatCard label="Profile completion" value={`${completion.percentage}%`} hint="Shared profile and partner role profile contribute here." icon="task_alt" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="My opportunities" value={formatNumber(myOpportunities.items?.length ?? 0)} hint="Opportunity posts currently associated with this partner account." icon="rocket_launch" />
        <StatCard label="Open ecosystem opportunities" value={formatNumber(allOpportunities.items?.length ?? 0)} hint="Current opportunity hub volume across the platform." icon="campaign" />
        <StatCard label="Published advisory" value={formatNumber(advisorySummary.publishedAdvisoryItems ?? 0)} hint="Current advisory resources visible to authenticated users." icon="article" tone="gold" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard href={`/${locale}/partner/profile`} title="Partner profile" description="Maintain the organization type, name, and focus area used in partner workflows." icon="badge" cta="Open partner profile" />
        <ActionCard href={`/${locale}/opportunities/new`} title="Publish opportunity" description="Share trainings, partnerships, or calls using the approved opportunity workflow." icon="tips_and_updates" cta="Create opportunity" />
        <ActionCard href={`/${locale}/advisory`} title="Browse advisory" description="Stay close to the live advisory library and crop-based guidance content." icon="menu_book" cta="Open advisory" />
      </div>
      <Link href={`/${locale}/opportunities`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
        Open current opportunity hub
      </Link>
    </div>
  );
}
