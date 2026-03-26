import { adminListCourses } from '@/api/learning';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CourseStatusControl } from '@/features/admin/moderation-actions';

export default async function AdminCoursesPage() {
  const courses = await adminListCourses();
  return (
    <div className="space-y-4">
      <Card><h1 className="text-2xl font-bold">Course management</h1><p className="mt-2 text-sm text-ink/70">Promote draft content to published status only when lesson structures and summaries are ready for learners.</p></Card>
      {courses.items?.map((course: any) => (
        <Card key={course.id} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold">{course.title}</h2><p className="mt-1 text-sm text-ink/70">{course.summary || 'No summary yet'}</p></div>
            <Badge>{course.status}</Badge>
          </div>
          <CourseStatusControl course={course} />
        </Card>
      ))}
    </div>
  );
}
