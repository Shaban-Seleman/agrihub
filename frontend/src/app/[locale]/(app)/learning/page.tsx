import Link from 'next/link';
import { getLearningHome, listCourses, getCourseProgress } from '@/api/learning';
import { CourseCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { FilterChip, StatusPill } from '@/components/app/primitives';
import { EmptyState } from '@/components/states/empty-state';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatNumber } from '@/lib/presentation';

export default async function LearningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [courses, progress, learningHome] = await Promise.all([listCourses(), getCourseProgress(), getLearningHome()]);
  const progressItems = (progress ?? []) as any[];
  const courseItems = (courses.items ?? []) as any[];
  const progressByCourseId = new Map<string, any>(progressItems.map((item) => [String(item.courseId), item]));
  const featuredCourseCandidate = learningHome?.featuredCourse;
  const featuredCourse = featuredCourseCandidate?.id != null ? featuredCourseCandidate : courseItems[0] ?? null;
  const currentProgress = progressItems.find((item) => Number(item.percentage ?? 0) > 0 && Number(item.percentage ?? 0) < 100)
    ?? progressItems.find((item) => Number(item.percentage ?? 0) === 100)
    ?? null;
  const currentCourse = courseItems.find((course) => String(course.id) === String(currentProgress?.courseId))
    ?? featuredCourse
    ?? courseItems[0]
    ?? null;
  const currentCourseProgress = currentCourse ? progressByCourseId.get(String(currentCourse.id)) : null;
  const percentage = Number(currentCourseProgress?.percentage ?? 0);
  const statusLabel = percentage === 0 ? 'Not started' : percentage >= 100 ? 'Completed' : 'In progress';
  const featuredProgress = featuredCourse ? progressByCourseId.get(String(featuredCourse.id)) : null;
  const hasAnyProgress = progressItems.some((item) => Number(item.percentage ?? 0) > 0);
  const recommended = !courseItems.length
    ? { title: 'Learning library is empty', description: 'Ask an admin to publish courses so learners can begin training.', href: null, button: null }
    : !hasAnyProgress && featuredCourse
      ? { title: 'Start your first lesson', description: 'Begin with the featured course and build momentum quickly.', href: `/${locale}/learning/${featuredCourse.id}`, button: 'Start Learning' }
    : currentProgress && Number(currentProgress.percentage ?? 0) < 100
      ? { title: 'Continue your course', description: `Resume ${currentCourse?.title} from where you left off.`, href: `/${locale}/learning/${currentCourse?.id}`, button: 'Continue Course' }
      : { title: 'Record farming activity', description: 'You have completed your current learning path. Capture field progress next.', href: `/${locale}/farming-activities/new`, button: 'Record Activity' };

  return (
    <div className="space-y-10">
      <HeroPanel
        eyebrow="AgriLearn"
        title={
          <>
            Cultivate knowledge,
            <br />
            <span className="italic text-soil">grow with confidence.</span>
          </>
        }
        subtitle="Practical agribusiness lessons designed for action in the field, the market, and enterprise growth."
        accent={
          <div className="rounded-[2rem] bg-white p-5 text-ink shadow-card">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Learning milestone</p>
            <p className="mt-3 font-headline text-5xl font-bold">{formatNumber(percentage)}%</p>
            <p className="mt-2 text-sm text-muted">{currentCourse ? `${currentCourse.title}` : 'No active course yet'}</p>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active>All courses</FilterChip>
        <FilterChip>Crop production</FilterChip>
        <FilterChip>Enterprise growth</FilterChip>
        <FilterChip>Market readiness</FilterChip>
      </div>

      {currentCourse ? (
        <div className="rounded-[2rem] bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">Progress summary</p>
              <h2 className="mt-2 font-headline text-4xl font-bold text-ink">{currentCourse.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{currentCourse.summary}</p>
            </div>
            <StatusPill tone={percentage === 0 ? 'gold' : percentage >= 100 ? 'dark' : 'green'}>{statusLabel}</StatusPill>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>{formatNumber(currentCourseProgress?.completedLessons ?? 0)} / {formatNumber(currentCourseProgress?.totalLessons ?? currentCourse.totalLessons ?? 0)} lessons completed</span>
                <span>{formatNumber(percentage)}%</span>
              </div>
              <ProgressBar value={percentage} />
            </div>
            <Link href={`/${locale}/learning/${currentCourse.id}`}>
              <Button className="w-full md:w-auto">{percentage === 0 ? 'Start Course' : 'Continue Course'}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState title="No courses available yet" description="Published AgriLearn content will appear here once an administrator adds it." />
      )}

      {featuredCourse?.id != null ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] editorial-gradient p-7 text-white shadow-float">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Featured course</p>
            <h2 className="mt-3 font-headline text-4xl font-bold">{featuredCourse.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">{featuredCourse.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusPill tone="gold">{formatNumber(featuredCourse.totalLessons ?? featuredProgress?.totalLessons ?? 0)} lessons</StatusPill>
              <StatusPill tone="green">{formatNumber(featuredProgress?.percentage ?? 0)}% progress</StatusPill>
            </div>
            <div className="mt-6">
              <Link href={`/${locale}/learning/${featuredCourse.id}`}>
                <Button variant="secondary">{Number(featuredProgress?.percentage ?? 0) > 0 ? 'Continue Learning' : 'View Course'}</Button>
              </Link>
            </div>
          </div>
          <StatCard
            label="Recommended next step"
            value={recommended.title}
            hint={recommended.description}
            icon="task_alt"
            tone="light"
          />
        </div>
      ) : null}

      <div className="rounded-[2rem] editorial-gradient p-6 text-white shadow-float">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">Recommended next step</p>
            <h2 className="mt-2 font-headline text-3xl font-bold">{recommended.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{recommended.description}</p>
          </div>
          {recommended.href && recommended.button ? (
            <Link href={recommended.href}>
              <Button variant="secondary">{recommended.button}</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeader
          eyebrow="Course library"
          title="Available courses"
          subtitle={`${formatNumber(courses.items?.length ?? 0)} published courses ready for authenticated learners.`}
        />
        {!courseItems.length ? (
          <EmptyState title="No published courses yet" description="Once course content is published by an administrator, it will appear here for all authenticated users." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courseItems.map((course) => {
              const courseProgress = progressByCourseId.get(String(course.id));
              const coursePercentage = Number(courseProgress?.percentage ?? 0);
              const courseStatus = coursePercentage === 0 ? 'Ready to start' : coursePercentage >= 100 ? 'Completed' : 'In progress';

              return (
                <CourseCard
                  key={course.id}
                  href={`/${locale}/learning/${course.id}`}
                  title={course.title}
                  description={course.summary}
                  lessons={`${formatNumber(course.totalLessons ?? courseProgress?.totalLessons ?? 0)} lessons`}
                  progress={coursePercentage}
                  status={courseStatus}
                  actionLabel={coursePercentage > 0 ? 'Open course' : 'Start learning'}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
