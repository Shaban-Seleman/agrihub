import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, getCourseProgress } from '@/api/learning';
import { CourseCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/presentation';

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale, courseId } = await params;

  if (!/^\d+$/.test(courseId)) {
    notFound();
  }

  const [course, progress] = await Promise.all([getCourse(courseId), getCourseProgress()]);
  const courseProgress = (progress ?? []).find((item: any) => String(item.courseId) === String(courseId));
  const percentage = Number(courseProgress?.percentage ?? 0);
  const completedLessons = Number(courseProgress?.completedLessons ?? 0);
  const totalLessons = Number(courseProgress?.totalLessons ?? course.totalLessons ?? 0);
  const firstLesson = course.modules?.flatMap((module: any) => module.lessons ?? [])[0] ?? null;

  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="Course detail"
        title={course.title}
        subtitle={course.summary}
        action={firstLesson ? <Link href={`/${locale}/learning/${courseId}/lesson/${firstLesson.id}`}><Button>{percentage > 0 ? 'Continue course' : 'Start course'}</Button></Link> : null}
        accent={
          <div className="space-y-3 rounded-[2rem] bg-white p-5 shadow-card">
            <StatusPill tone={percentage === 0 ? 'gold' : percentage >= 100 ? 'dark' : 'green'}>
              {percentage === 0 ? 'Not started' : percentage >= 100 ? 'Completed' : 'In progress'}
            </StatusPill>
            <p className="font-headline text-4xl font-bold text-leaf">{formatNumber(percentage)}%</p>
            <p className="text-sm text-muted">{completedLessons} of {totalLessons} lessons complete</p>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Modules" value={formatNumber(course.modules?.length ?? 0)} hint="Structured learning blocks in this course." icon="view_module" />
        <StatCard label="Lessons" value={formatNumber(totalLessons)} hint="Total lessons currently available." icon="menu_book" />
        <StatCard label="Progress" value={`${formatNumber(percentage)}%`} hint="Your current completion state for this course." icon="task_alt" tone="gold" />
      </div>

      <section className="space-y-5">
        <SectionHeader eyebrow="Learning path" title="Modules and lessons" subtitle="Continue through the course in order and use lesson feedback to improve content quality." />
        <div className="space-y-5">
          {course.modules?.map((module: any) => (
            <div key={module.id} className="rounded-[2rem] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">Module</p>
                  <h2 className="mt-2 font-headline text-3xl font-bold text-ink">{module.title}</h2>
                </div>
                <StatusPill tone="muted">{formatNumber(module.lessons?.length ?? 0)} lessons</StatusPill>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {module.lessons?.map((lesson: any) => (
                  <CourseCard
                    key={lesson.id}
                    href={`/${locale}/learning/${courseId}/lesson/${lesson.id}`}
                    title={lesson.title}
                    description={lesson.summary || 'Open this lesson to continue the learning sequence.'}
                    lessons={`${formatNumber(lesson.durationMinutes ?? 0)} minutes`}
                    progress={String(lesson.id) === String(courseProgress?.lastLessonId) ? percentage : lesson.completed ? 100 : 0}
                    status={lesson.completed ? 'Completed' : 'Open lesson'}
                    actionLabel="Open lesson"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
