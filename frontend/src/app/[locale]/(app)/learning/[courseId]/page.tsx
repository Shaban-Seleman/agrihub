import Link from 'next/link';
import { getCourse } from '@/api/learning';
import { Card } from '@/components/ui/card';

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale, courseId } = await params;
  const course = await getCourse(courseId);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="mt-3 text-sm text-black/70">{course.summary}</p>
      </Card>
      {course.modules?.map((module: any) => (
        <Card key={module.id}>
          <h2 className="font-semibold">{module.title}</h2>
          <div className="mt-3 space-y-2">
            {module.lessons?.map((lesson: any) => (
              <Link key={lesson.id} href={`/${locale}/learning/${courseId}/lesson/${lesson.id}`} className="block rounded-xl border border-black/10 p-3">
                {lesson.title}
              </Link>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
