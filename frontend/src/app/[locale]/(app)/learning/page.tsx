import Link from 'next/link';
import { getLearningHome, listCourses, getCourseProgress } from '@/api/learning';
import { EmptyState } from '@/components/states/empty-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatNumber } from '@/lib/presentation';

export default async function LearningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [courses, progress, learningHome] = await Promise.all([listCourses(), getCourseProgress(), getLearningHome()]);
  const progressItems = (progress ?? []) as any[];
  const courseItems = (courses.items ?? []) as any[];
  const progressByCourseId = new Map<string, any>(progressItems.map((item) => [String(item.courseId), item]));
  const currentProgress = progressItems.find((item) => Number(item.percentage ?? 0) > 0 && Number(item.percentage ?? 0) < 100)
    ?? progressItems.find((item) => Number(item.percentage ?? 0) === 100)
    ?? null;
  const currentCourse = courseItems.find((course) => String(course.id) === String(currentProgress?.courseId))
    ?? learningHome.featuredCourse
    ?? courseItems[0]
    ?? null;
  const currentCourseProgress = currentCourse ? progressByCourseId.get(String(currentCourse.id)) : null;
  const percentage = Number(currentCourseProgress?.percentage ?? 0);
  const statusLabel = percentage === 0 ? 'Not started' : percentage >= 100 ? 'Completed' : 'In progress';
  const featuredCourse = learningHome.featuredCourse ?? courses.items?.[0] ?? null;
  const featuredProgress = featuredCourse ? progressByCourseId.get(String(featuredCourse.id)) : null;
  const hasAnyProgress = progressItems.some((item) => Number(item.percentage ?? 0) > 0);
  const recommended = !courseItems.length
    ? { title: 'Learning library is empty', description: 'Ask an admin to publish courses so learners can begin training.', href: null, button: null }
    : !hasAnyProgress
      ? { title: 'Start your first lesson', description: 'Begin with the featured course and build momentum quickly.', href: `/${locale}/learning/${featuredCourse?.id}`, button: 'Start Learning' }
      : currentProgress && Number(currentProgress.percentage ?? 0) < 100
        ? { title: 'Continue your course', description: `Resume ${currentCourse?.title} from where you left off.`, href: `/${locale}/learning/${currentCourse?.id}`, button: 'Continue Course' }
        : { title: 'Record farming activity', description: 'You have completed your current learning path. Capture field progress next.', href: `/${locale}/farming-activities/new`, button: 'Record Activity' };

  return (
    <div className="space-y-6">
      <div>
        <Badge>AgriLearn</Badge>
        <h1 className="mt-2 text-3xl font-bold">Courses</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">Practical agribusiness lessons designed for action in the field, the market, and enterprise growth.</p>
      </div>
      {currentCourse ? (
        <Card className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">Progress summary</p>
              <h2 className="mt-2 text-2xl font-bold">{currentCourse.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink/70">{currentCourse.summary}</p>
            </div>
            <Badge className={percentage > 0 && percentage < 100 ? 'bg-leaf/15 text-leaf' : ''}>{statusLabel}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-ink/70">
                <span>{formatNumber(currentCourseProgress?.completedLessons ?? 0)} / {formatNumber(currentCourseProgress?.totalLessons ?? currentCourse.totalLessons ?? 0)} lessons completed</span>
                <span>{formatNumber(percentage)}%</span>
              </div>
              <ProgressBar value={percentage} />
            </div>
            <Link href={`/${locale}/learning/${currentCourse.id}`}>
              <Button className="w-full md:w-auto">{percentage === 0 ? 'Start Course' : 'Continue Course'}</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <EmptyState title="No courses available yet" description="Published AgriLearn content will appear here once an administrator adds it." />
      )}

      {featuredCourse ? (
        <Card className="overflow-hidden bg-gradient-to-br from-sand to-cream">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soil">Featured course</p>
              <h2 className="text-2xl font-bold">{featuredCourse.title}</h2>
              <p className="text-sm leading-6 text-ink/75">{featuredCourse.summary}</p>
              <div className="flex flex-wrap gap-2 text-sm text-ink/70">
                <Badge>{formatNumber(featuredCourse.totalLessons ?? featuredProgress?.totalLessons ?? 0)} lessons</Badge>
                <Badge>{formatNumber(featuredProgress?.percentage ?? 0)}% progress</Badge>
              </div>
            </div>
            <div className="flex items-end justify-start lg:justify-end">
              <Link href={`/${locale}/learning/${featuredCourse.id}`}>
                <Button>{Number(featuredProgress?.percentage ?? 0) > 0 ? 'Continue Learning' : 'View Course'}</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="flex flex-col gap-4 rounded-[1.6rem] bg-ink text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Recommended next step</p>
          <h2 className="mt-2 text-xl font-bold">{recommended.title}</h2>
          <p className="mt-2 text-sm text-white/75">{recommended.description}</p>
        </div>
        {recommended.href && recommended.button ? (
          <Link href={recommended.href}>
            <Button variant="secondary">{recommended.button}</Button>
          </Link>
        ) : null}
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Available courses</h2>
          <p className="text-sm text-ink/65">{formatNumber(courses.items?.length ?? 0)} published courses</p>
        </div>
        {!courseItems.length ? (
          <EmptyState title="No published courses yet" description="Once course content is published by an administrator, it will appear here for all authenticated users." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courseItems.map((course) => {
              const courseProgress = progressByCourseId.get(String(course.id));
              const coursePercentage = Number(courseProgress?.percentage ?? 0);
              const courseStatus = coursePercentage === 0 ? 'Ready to start' : coursePercentage >= 100 ? 'Completed' : 'Continue learning';

              return (
                <Link key={course.id} href={`/${locale}/learning/${course.id}`}>
                  <Card className="flex h-full flex-col justify-between space-y-4 transition hover:-translate-y-0.5">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <Badge>{courseStatus}</Badge>
                      </div>
                      <p className="text-sm leading-6 text-ink/70">{course.summary}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-ink/65">
                        <span>{formatNumber(courseProgress?.completedLessons ?? 0)} / {formatNumber(courseProgress?.totalLessons ?? course.totalLessons ?? 0)} lessons</span>
                        <span>{formatNumber(coursePercentage)}%</span>
                      </div>
                      <ProgressBar value={coursePercentage} />
                      <div className="pt-1">
                        <Button className="w-full" variant={coursePercentage > 0 ? 'secondary' : 'primary'}>
                          {coursePercentage > 0 ? 'Open Course' : 'Start Learning'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
