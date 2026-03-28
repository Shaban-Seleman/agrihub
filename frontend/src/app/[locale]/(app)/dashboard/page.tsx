import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getLearningHome, getCourseProgress, listCourses } from '@/api/learning';
import { getMarketSummary, listDemand } from '@/api/market';
import { listOpportunities } from '@/api/opportunities';
import { getProfileCompletion } from '@/api/profile';
import { getFarmingSummary, listMyActivities } from '@/api/farming';
import { ActionCard, ActivityCard, MarketListingCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { Icon, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { canAccessDashboard, getRoleHomePath } from '@/lib/auth/navigation';
import { requireSession } from '@/lib/auth/session';
import { formatDate, formatDateTime, formatNumber } from '@/lib/presentation';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession();

  if (!canAccessDashboard(session.accountType)) {
    redirect(getRoleHomePath(locale, session.accountType));
  }

  const [profileCompletion, courses, progress, learningHome, farmingSummary, activities, marketSummary, demand, opportunities] = await Promise.all([
    getProfileCompletion(),
    listCourses(),
    getCourseProgress(),
    getLearningHome(),
    getFarmingSummary(),
    listMyActivities(),
    getMarketSummary(),
    listDemand(),
    listOpportunities()
  ]);

  const progressItems = (progress ?? []) as any[];
  const courseItems = (courses.items ?? []) as any[];
  const activeCourseProgress = progressItems.find((item) => Number(item.percentage ?? 0) > 0 && Number(item.percentage ?? 0) < 100);
  const featuredCourseCandidate = learningHome?.featuredCourse;
  const featuredCourse = courseItems.find((course) => String(course.id) === String(activeCourseProgress?.courseId))
    ?? (featuredCourseCandidate?.id != null ? featuredCourseCandidate : null)
    ?? courseItems[0]
    ?? null;
  const progressValue = Number(activeCourseProgress?.percentage ?? 0);
  const recentActivities = (activities.items ?? []).slice(0, 2);
  const openDemand = (demand.items ?? []).slice(0, 2);
  const featuredOpportunity = (opportunities.items ?? [])[0] ?? null;

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="Farmer Dashboard"
        title={
          <>
            Welcome back,
            <br />
            <span className="italic text-sun">ready to grow?</span>
          </>
        }
        subtitle="Track your learning, log your field activities, and respond to real market demand from one mobile-first action hub."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/learning`}>
              <Button>Continue learning</Button>
            </Link>
            <Link href={`/${locale}/farming-activities/new`}>
              <Button variant="secondary">Add activity</Button>
            </Link>
          </div>
        }
        accent={
          <div className="rounded-[2rem] bg-white/10 p-5 text-white ring-1 ring-white/15">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Profile strength</p>
            <p className="mt-3 font-headline text-5xl font-bold">{formatNumber(profileCompletion.percentage ?? 0)}%</p>
            <p className="mt-2 text-sm text-white/75">Complete your profile to improve advisory and opportunity matching.</p>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard href={`/${locale}/learning`} title="AgriLearn" description="Follow practical lessons for production, market readiness, and enterprise growth." icon="school" cta={progressValue > 0 ? 'Continue course' : 'Start learning'} />
        <ActionCard href={`/${locale}/farming-activities/new`} title="Field records" description="Capture planting, land use, and harvest progress with clean seasonal reporting." icon="agriculture" cta="Record activity" />
        <ActionCard href={`/${locale}/market`} title="Market watch" description="View active buyer demand and keep your produce visible to agribusiness buyers." icon="storefront" cta="Explore market" />
        <ActionCard href={`/${locale}/opportunities`} title="Opportunities" description="Browse training, grants, and partnership openings relevant to your crop journey." icon="rocket_launch" cta="Open hub" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current course" value={featuredCourse?.title ?? 'No course yet'} hint={featuredCourse ? `${formatNumber(activeCourseProgress?.completedLessons ?? 0)} lessons completed` : 'Published courses will appear here.'} icon="menu_book" />
        <StatCard label="Tracked activities" value={formatNumber(farmingSummary.totalActivities ?? recentActivities.length)} hint={`${formatNumber(farmingSummary.harvestedActivities ?? 0)} harvested records`} icon="grass" />
        <StatCard label="Buyer demand" value={formatNumber(marketSummary.activeDemandListings ?? 0)} hint="Active demand listings in the market hub" icon="shopping_bag" />
        <StatCard label="Open opportunities" value={formatNumber(opportunities.items?.length ?? 0)} hint="Current grants, tenders, and training openings" icon="tips_and_updates" tone="gold" />
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Production focus"
            title="Your current field records"
            subtitle="Recent crop activities stay visible here so you can update progress quickly."
          />
          {recentActivities.length ? (
            <div className="grid gap-4">
              {recentActivities.map((activity: any) => (
                <ActivityCard
                  key={activity.id}
                  href={`/${locale}/farming-activities/${activity.id}`}
                  title={activity.cropName}
                  subtitle={activity.seasonCode}
                  badge={<StatusPill tone={activity.status === 'HARVESTED' ? 'gold' : 'green'}>{activity.status}</StatusPill>}
                  meta={[
                    `Planted ${formatDate(activity.plantingDate)}`,
                    `${activity.landSize} ${activity.landUnit}`,
                    activity.farmingMethod
                  ]}
                  accent={<Icon name="arrow_outward" className="text-[22px] text-leaf" />}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-line/60 bg-white p-6 text-center text-sm text-muted">
              No farming activity has been recorded yet. Add your first field activity to begin season tracking.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <SectionHeader
            eyebrow="Market demand"
            title="What buyers need now"
            subtitle="Use the market hub to compare active demand and plan your next listing."
          />
          <div className="grid gap-4">
            {openDemand.length ? (
              openDemand.map((listing: any, index: number) => (
                <MarketListingCard
                  key={listing.id}
                  href={`/${locale}/market/demand/${listing.id}`}
                  title={listing.title}
                  crop={listing.cropName}
                  quantity={`${formatNumber(listing.quantity)} ${listing.unit}`}
                  expiry={formatDateTime(listing.expiresAt)}
                  location={listing.regionName || listing.districtName || 'Tanzania'}
                  badge={<StatusPill tone={index === 0 ? 'gold' : 'green'}>{listing.status}</StatusPill>}
                  tone={index === 0 ? 'dark' : 'light'}
                />
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-line/60 bg-white p-6 text-center text-sm text-muted">
                No active buyer demand is available right now.
              </div>
            )}
          </div>
          {featuredOpportunity ? (
            <div className="rounded-[2rem] bg-white p-6 shadow-card">
              <StatusPill tone="gold">{featuredOpportunity.opportunityType}</StatusPill>
              <h3 className="mt-5 font-headline text-3xl font-bold text-ink">{featuredOpportunity.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{featuredOpportunity.summary}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">{featuredOpportunity.regionName || 'National'}</span>
                <Link href={`/${locale}/opportunities/${featuredOpportunity.id}`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-leaf">
                  View details
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">Recommended next step</p>
            <h2 className="mt-2 font-headline text-3xl font-bold text-ink">
              {progressValue > 0 ? 'Continue your current course' : 'Start your first lesson'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {featuredCourse
                ? `Open ${featuredCourse.title} and keep building practical agribusiness skills alongside your field records.`
                : 'Visit AgriLearn to begin with your first practical course.'}
            </p>
          </div>
          <Link href={featuredCourse ? `/${locale}/learning/${featuredCourse.id}` : `/${locale}/learning`}>
            <Button>{progressValue > 0 ? 'Continue course' : 'Start course'}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
