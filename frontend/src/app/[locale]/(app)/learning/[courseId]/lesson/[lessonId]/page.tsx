import Link from 'next/link';
import { getCourse, getLesson, getLessonFeedback } from '@/api/learning';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/states/empty-state';
import { LessonActions } from '@/features/learning/lesson-actions';
import { formatNumber } from '@/lib/presentation';

function buildLessonSummary(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(Boolean) ?? 'Review the full lesson content below to continue learning.';
}

export default async function LessonPage({
  params
}: {
  params: Promise<{ locale: string; courseId: string; lessonId: string }>;
}) {
  const { locale, courseId, lessonId } = await params;
  const [lesson, course, feedback] = await Promise.all([getLesson(lessonId), getCourse(courseId), getLessonFeedback(lessonId)]);
  const modules = course.modules ?? [];
  const module = modules.find((item: any) => Number(item.id) === Number(lesson.moduleId));
  const lessons = modules.flatMap((item: any) => (item.lessons ?? []).map((entry: any) => ({ ...entry, moduleTitle: item.title })));
  const lessonIndex = lessons.findIndex((entry: any) => Number(entry.id) === Number(lesson.id));
  const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 && lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const summary = buildLessonSummary(lesson.content);
  const isEmbeddable = typeof lesson.mediaUrl === 'string'
    && (lesson.mediaUrl.includes('youtube.com/embed')
      || lesson.mediaUrl.includes('player.vimeo.com')
      || lesson.mediaUrl.endsWith('.mp4'));

  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
        <Link href={`/${locale}/learning`} className="hover:text-leaf">AgriLearn</Link>
        <span>/</span>
        <Link href={`/${locale}/learning/${courseId}`} className="hover:text-leaf">{course.title}</Link>
        <span>/</span>
        <span className="text-ink">{lesson.title}</span>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Lesson detail</Badge>
              <Badge>{module?.title ?? 'Course module'}</Badge>
              <Badge className={lesson.completed ? 'bg-leaf/15 text-leaf' : ''}>{lesson.completed ? 'Completed' : 'In progress'}</Badge>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <p className="mt-3 text-sm text-ink/70">{module?.title ?? 'Course module'} · Approx. {formatNumber(lesson.durationMinutes ?? 0)} minutes</p>
            </div>
            <div className="rounded-[1.4rem] bg-cream p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Lesson summary</p>
              <p className="mt-3 text-sm leading-7 text-ink/80">{summary}</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Video section</h2>
                <p className="mt-1 text-sm text-ink/70">Watch or open the lesson media if it is provided for this module.</p>
              </div>
            </div>
            {lesson.mediaUrl ? (
              isEmbeddable ? (
                lesson.mediaUrl.endsWith('.mp4') ? (
                  <video controls className="aspect-video w-full rounded-[1.2rem] bg-black" src={lesson.mediaUrl} />
                ) : (
                  <iframe
                    src={lesson.mediaUrl}
                    title={lesson.title}
                    className="aspect-video w-full rounded-[1.2rem] border-0 bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="rounded-[1.2rem] border border-black/10 p-4">
                  <p className="text-sm text-ink/70">This lesson includes external media.</p>
                  <a href={lesson.mediaUrl} target="_blank" className="mt-3 inline-block text-sm font-semibold text-leaf underline" rel="noreferrer">
                    Open video or media resource
                  </a>
                </div>
              )
            ) : (
              <EmptyState title="No video attached" description="This lesson is text-first. Continue with the reading below and use the feedback block after completion." />
            )}
          </Card>

          <Card className="space-y-4">
            <h2 className="text-xl font-semibold">Lesson notes</h2>
            <div className="rounded-[1.4rem] bg-white">
              <div className="whitespace-pre-wrap text-sm leading-8 text-black/80">{lesson.content}</div>
            </div>
          </Card>
        </div>

        <LessonActions
          lessonId={lessonId}
          previousHref={previousLesson ? `/${locale}/learning/${courseId}/lesson/${previousLesson.id}` : null}
          nextHref={nextLesson ? `/${locale}/learning/${courseId}/lesson/${nextLesson.id}` : null}
          initialFeedback={feedback}
          completed={lesson.completed}
        />
      </div>
    </div>
  );
}
