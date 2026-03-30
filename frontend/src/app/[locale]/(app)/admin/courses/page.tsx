import { adminListCourses, getAdminCourse } from '@/api/learning';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { StatusPill } from '@/components/app/primitives';
import { CourseAuthoringPanel } from '@/features/admin/course-authoring-panel';
import { formatNumber } from '@/lib/presentation';

export default async function AdminCoursesPage() {
  const courses = await adminListCourses();
  const items = (courses.items ?? []) as any[];
  const detailedCourses = await Promise.all(items.map((course) => getAdminCourse(course.id)));
  const drafts = items.filter((course) => course.status === 'DRAFT').length;
  const published = items.filter((course) => course.status === 'PUBLISHED').length;
  const archived = items.filter((course) => course.status === 'ARCHIVED').length;

  return (
    <div className="space-y-8">
      <PageHeader
        badge={<StatusPill tone="dark">Admin learning</StatusPill>}
        title="Course management"
        subtitle="Promote draft content only when summaries, lesson structure, and learner-facing sequencing are ready."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetricCard label="Total courses" value={formatNumber(items.length)} icon="menu_book" />
        <CompactMetricCard label="Draft" value={formatNumber(drafts)} icon="edit_note" tone="sand" />
        <CompactMetricCard label="Published" value={formatNumber(published)} icon="published_with_changes" />
        <CompactMetricCard label="Archived" value={formatNumber(archived)} icon="inventory_2" />
      </div>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Publishing controls"
          title="Course records"
          subtitle="Manage course status, module structure, lesson content, and learner feedback summaries through the existing admin endpoints."
        />
        <CourseAuthoringPanel courses={detailedCourses} />
      </section>
    </div>
  );
}
