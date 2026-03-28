import { adminListCourses } from '@/api/learning';
import { CompactMetricCard } from '@/components/app/governance';
import { PageHeader, SectionHeader } from '@/components/app/layout';
import { ModerationActionBar, StatusPill } from '@/components/app/primitives';
import { Card } from '@/components/ui/card';
import { CourseStatusControl } from '@/features/admin/moderation-actions';
import { formatNumber } from '@/lib/presentation';

export default async function AdminCoursesPage() {
  const courses = await adminListCourses();
  const items = (courses.items ?? []) as any[];
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
          subtitle="Status updates use the existing backend workflow only; this page does not introduce unsupported editing features."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((course) => (
            <Card key={course.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <h2 className="font-headline text-3xl font-bold text-ink">{course.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{course.summary || 'No summary added yet.'}</p>
                </div>
                <StatusPill tone={course.status === 'PUBLISHED' ? 'green' : course.status === 'ARCHIVED' ? 'gold' : 'muted'}>
                  {course.status}
                </StatusPill>
              </div>
              <ModerationActionBar>
                <CourseStatusControl course={course} />
              </ModerationActionBar>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
