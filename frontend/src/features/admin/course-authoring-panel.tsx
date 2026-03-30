'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { archiveCourse, fetchLessonFeedbackSummary, saveCourse, saveCourseModule, saveLesson, updateCourseModule, updateLesson } from '@/api/learning-client';
import { FieldGroup, FormField } from '@/components/app/forms';
import { DetailSection, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type AdminLesson = {
  id: number;
  title: string;
  content: string;
  mediaUrl?: string | null;
  durationMinutes?: number | null;
  displayOrder: number;
  status: string;
};

type AdminModule = {
  id: number;
  title: string;
  summary?: string | null;
  displayOrder: number;
  lessons: AdminLesson[];
};

type AdminCourse = {
  id: number;
  title: string;
  summary?: string | null;
  coverImageUrl?: string | null;
  status: string;
  totalLessons: number;
  modules: AdminModule[];
};

function FormNotice({ error, success }: { error?: string | null; success?: string | null }) {
  if (error) {
    return <p className="text-xs text-red-600">{error}</p>;
  }

  if (success) {
    return <p className="text-xs text-leaf">{success}</p>;
  }

  return null;
}

function CourseHeaderActions({ course }: { course: AdminCourse }) {
  const router = useRouter();
  const [status, setStatus] = useState(course.status);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-44">
          {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Button
          type="button"
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await saveCourse(course.id, {
                title: course.title,
                summary: course.summary ?? '',
                coverImageUrl: course.coverImageUrl ?? '',
                status
              });
              setSuccess('Course status updated');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update course');
            }
          }}
        >
          Save status
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            try {
              setError(null);
              setSuccess(null);
              await archiveCourse(course.id);
              setStatus('ARCHIVED');
              setSuccess('Course archived');
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to archive course');
            }
          }}
        >
          Archive
        </Button>
      </div>
      <FormNotice error={error} success={success} />
    </div>
  );
}

function ModuleEditor({ courseId, module }: { courseId: number; module: AdminModule }) {
  const router = useRouter();
  const [moduleState, setModuleState] = useState({
    title: module.title,
    summary: module.summary ?? '',
    displayOrder: String(module.displayOrder)
  });
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [moduleSuccess, setModuleSuccess] = useState<string | null>(null);
  const [lessonFeedback, setLessonFeedback] = useState<Record<number, { loading?: boolean; data?: any; error?: string }>>({});
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    durationMinutes: '',
    displayOrder: String(module.lessons.length + 1),
    status: 'DRAFT'
  });
  const [newLessonState, setNewLessonState] = useState<{ error?: string | null; success?: string | null }>({});

  return (
    <DetailSection title={module.title} subtitle="Update module structure, then add or refine lessons beneath it.">
      <div className="space-y-5">
        <FieldGroup>
          <FormField label="Module title">
            <Input value={moduleState.title} onChange={(event) => setModuleState((current) => ({ ...current, title: event.target.value }))} />
          </FormField>
          <FormField label="Display order">
            <Input
              type="number"
              min={1}
              value={moduleState.displayOrder}
              onChange={(event) => setModuleState((current) => ({ ...current, displayOrder: event.target.value }))}
            />
          </FormField>
        </FieldGroup>
        <FormField label="Module summary">
          <Textarea value={moduleState.summary} onChange={(event) => setModuleState((current) => ({ ...current, summary: event.target.value }))} />
        </FormField>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={async () => {
              try {
                setModuleError(null);
                setModuleSuccess(null);
                await updateCourseModule(module.id, {
                  title: moduleState.title,
                  summary: moduleState.summary,
                  displayOrder: Number(moduleState.displayOrder)
                });
                setModuleSuccess('Module updated');
                router.refresh();
              } catch (cause) {
                setModuleError(cause instanceof Error ? cause.message : 'Unable to update module');
              }
            }}
          >
            Save module
          </Button>
          <StatusPill tone="muted">{module.lessons.length} lessons</StatusPill>
        </div>
        <FormNotice error={moduleError} success={moduleSuccess} />

        <div className="space-y-4 rounded-[1.6rem] bg-sand p-4">
          <div>
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">Lessons</p>
            <h4 className="mt-2 font-headline text-2xl font-bold text-ink">Module lessons</h4>
          </div>

          {module.lessons.map((lesson) => (
            <LessonEditor
              key={lesson.id}
              lesson={lesson}
              feedbackState={lessonFeedback[lesson.id]}
              onFeedbackLoad={async () => {
                setLessonFeedback((current) => ({ ...current, [lesson.id]: { loading: true } }));
                try {
                  const data = await fetchLessonFeedbackSummary(lesson.id);
                  setLessonFeedback((current) => ({ ...current, [lesson.id]: { data } }));
                } catch (cause) {
                  setLessonFeedback((current) => ({
                    ...current,
                    [lesson.id]: { error: cause instanceof Error ? cause.message : 'Unable to load feedback summary' }
                  }));
                }
              }}
            />
          ))}

          <div className="rounded-[1.5rem] border border-line/40 bg-white p-4">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-soil">Add lesson</p>
            <div className="mt-4 space-y-4">
              <FieldGroup>
                <FormField label="Lesson title">
                  <Input value={newLesson.title} onChange={(event) => setNewLesson((current) => ({ ...current, title: event.target.value }))} />
                </FormField>
                <FormField label="Media URL">
                  <Input value={newLesson.mediaUrl} onChange={(event) => setNewLesson((current) => ({ ...current, mediaUrl: event.target.value }))} />
                </FormField>
              </FieldGroup>
              <FieldGroup>
                <FormField label="Duration minutes">
                  <Input
                    type="number"
                    min={0}
                    value={newLesson.durationMinutes}
                    onChange={(event) => setNewLesson((current) => ({ ...current, durationMinutes: event.target.value }))}
                  />
                </FormField>
                <FormField label="Display order">
                  <Input
                    type="number"
                    min={1}
                    value={newLesson.displayOrder}
                    onChange={(event) => setNewLesson((current) => ({ ...current, displayOrder: event.target.value }))}
                  />
                </FormField>
              </FieldGroup>
              <FormField label="Status">
                <Select value={newLesson.status} onChange={(event) => setNewLesson((current) => ({ ...current, status: event.target.value }))}>
                  {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Lesson content">
                <Textarea value={newLesson.content} onChange={(event) => setNewLesson((current) => ({ ...current, content: event.target.value }))} />
              </FormField>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      setNewLessonState({});
                      await saveLesson(module.id, {
                        title: newLesson.title,
                        content: newLesson.content,
                        mediaUrl: newLesson.mediaUrl || null,
                        durationMinutes: newLesson.durationMinutes ? Number(newLesson.durationMinutes) : null,
                        displayOrder: Number(newLesson.displayOrder),
                        status: newLesson.status
                      });
                      setNewLesson({
                        title: '',
                        content: '',
                        mediaUrl: '',
                        durationMinutes: '',
                        displayOrder: String(module.lessons.length + 1),
                        status: 'DRAFT'
                      });
                      setNewLessonState({ success: 'Lesson created' });
                      router.refresh();
                    } catch (cause) {
                      setNewLessonState({ error: cause instanceof Error ? cause.message : 'Unable to create lesson' });
                    }
                  }}
                >
                  Add lesson
                </Button>
              </div>
              <FormNotice error={newLessonState.error} success={newLessonState.success} />
            </div>
          </div>
        </div>
      </div>
    </DetailSection>
  );
}

function LessonEditor({
  lesson,
  feedbackState,
  onFeedbackLoad
}: {
  lesson: AdminLesson;
  feedbackState?: { loading?: boolean; data?: any; error?: string };
  onFeedbackLoad: () => Promise<void>;
}) {
  const router = useRouter();
  const [lessonState, setLessonState] = useState({
    title: lesson.title,
    content: lesson.content,
    mediaUrl: lesson.mediaUrl ?? '',
    durationMinutes: lesson.durationMinutes ? String(lesson.durationMinutes) : '',
    displayOrder: String(lesson.displayOrder),
    status: lesson.status
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="rounded-[1.5rem] border border-line/30 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h5 className="font-headline text-2xl font-bold text-ink">{lesson.title}</h5>
          <p className="mt-1 text-sm text-muted">Lesson #{lesson.displayOrder}</p>
        </div>
        <StatusPill tone={lesson.status === 'PUBLISHED' ? 'green' : lesson.status === 'ARCHIVED' ? 'gold' : 'muted'}>{lesson.status}</StatusPill>
      </div>

      <div className="mt-4 space-y-4">
        <FieldGroup>
          <FormField label="Lesson title">
            <Input value={lessonState.title} onChange={(event) => setLessonState((current) => ({ ...current, title: event.target.value }))} />
          </FormField>
          <FormField label="Media URL">
            <Input value={lessonState.mediaUrl} onChange={(event) => setLessonState((current) => ({ ...current, mediaUrl: event.target.value }))} />
          </FormField>
        </FieldGroup>
        <FieldGroup>
          <FormField label="Duration minutes">
            <Input
              type="number"
              min={0}
              value={lessonState.durationMinutes}
              onChange={(event) => setLessonState((current) => ({ ...current, durationMinutes: event.target.value }))}
            />
          </FormField>
          <FormField label="Display order">
            <Input
              type="number"
              min={1}
              value={lessonState.displayOrder}
              onChange={(event) => setLessonState((current) => ({ ...current, displayOrder: event.target.value }))}
            />
          </FormField>
        </FieldGroup>
        <FormField label="Status">
          <Select value={lessonState.status} onChange={(event) => setLessonState((current) => ({ ...current, status: event.target.value }))}>
            {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Lesson content">
          <Textarea value={lessonState.content} onChange={(event) => setLessonState((current) => ({ ...current, content: event.target.value }))} />
        </FormField>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={async () => {
              try {
                setError(null);
                setSuccess(null);
                await updateLesson(lesson.id, {
                  title: lessonState.title,
                  content: lessonState.content,
                  mediaUrl: lessonState.mediaUrl || null,
                  durationMinutes: lessonState.durationMinutes ? Number(lessonState.durationMinutes) : null,
                  displayOrder: Number(lessonState.displayOrder),
                  status: lessonState.status
                });
                setSuccess('Lesson updated');
                router.refresh();
              } catch (cause) {
                setError(cause instanceof Error ? cause.message : 'Unable to update lesson');
              }
            }}
          >
            Save lesson
          </Button>
          <Button type="button" variant="soft" onClick={() => void onFeedbackLoad()}>
            {feedbackState?.loading ? 'Loading summary...' : 'Feedback summary'}
          </Button>
        </div>
        {feedbackState?.data ? (
          <div className="rounded-[1.25rem] bg-sand p-4 text-sm text-ink">
            <p className="font-semibold">Total feedback: {feedbackState.data.totalFeedback}</p>
            <p className="mt-2">Helpful: {feedbackState.data.helpfulCount}</p>
            <p>Not helpful: {feedbackState.data.notHelpfulCount}</p>
          </div>
        ) : null}
        <FormNotice error={error ?? feedbackState?.error} success={success} />
      </div>
    </div>
  );
}

export function CourseAuthoringPanel({ courses }: { courses: AdminCourse[] }) {
  const router = useRouter();
  const [newModuleState, setNewModuleState] = useState<Record<number, { title: string; summary: string; displayOrder: string }>>({});
  const [newModuleFeedback, setNewModuleFeedback] = useState<Record<number, { error?: string | null; success?: string | null }>>({});

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <div key={course.id} className="rounded-[2rem] border border-line/30 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <StatusPill tone={course.status === 'PUBLISHED' ? 'green' : course.status === 'ARCHIVED' ? 'gold' : 'muted'}>
                  {course.status}
                </StatusPill>
                <StatusPill tone="muted">{course.totalLessons} published lessons</StatusPill>
              </div>
              <h3 className="font-headline text-3xl font-bold text-ink">{course.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{course.summary || 'No summary added yet.'}</p>
            </div>
            <CourseHeaderActions course={course} />
          </div>

          <div className="mt-6 space-y-5">
            {course.modules.map((module) => (
              <ModuleEditor key={module.id} courseId={course.id} module={module} />
            ))}

            <DetailSection title="Add module" subtitle="Create a new module before attaching lessons.">
              <div className="space-y-4">
                <FieldGroup>
                  <FormField label="Module title">
                    <Input
                      value={newModuleState[course.id]?.title ?? ''}
                      onChange={(event) =>
                        setNewModuleState((current) => ({
                          ...current,
                          [course.id]: { ...current[course.id], title: event.target.value, summary: current[course.id]?.summary ?? '', displayOrder: current[course.id]?.displayOrder ?? String(course.modules.length + 1) }
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Display order">
                    <Input
                      type="number"
                      min={1}
                      value={newModuleState[course.id]?.displayOrder ?? String(course.modules.length + 1)}
                      onChange={(event) =>
                        setNewModuleState((current) => ({
                          ...current,
                          [course.id]: { ...current[course.id], title: current[course.id]?.title ?? '', summary: current[course.id]?.summary ?? '', displayOrder: event.target.value }
                        }))
                      }
                    />
                  </FormField>
                </FieldGroup>
                <FormField label="Module summary">
                  <Textarea
                    value={newModuleState[course.id]?.summary ?? ''}
                    onChange={(event) =>
                      setNewModuleState((current) => ({
                        ...current,
                        [course.id]: { ...current[course.id], title: current[course.id]?.title ?? '', summary: event.target.value, displayOrder: current[course.id]?.displayOrder ?? String(course.modules.length + 1) }
                      }))
                    }
                  />
                </FormField>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        setNewModuleFeedback((current) => ({ ...current, [course.id]: {} }));
                        await saveCourseModule(course.id, {
                          title: newModuleState[course.id]?.title ?? '',
                          summary: newModuleState[course.id]?.summary ?? '',
                          displayOrder: Number(newModuleState[course.id]?.displayOrder ?? String(course.modules.length + 1))
                        });
                        setNewModuleState((current) => ({
                          ...current,
                          [course.id]: { title: '', summary: '', displayOrder: String(course.modules.length + 2) }
                        }));
                        setNewModuleFeedback((current) => ({ ...current, [course.id]: { success: 'Module created' } }));
                        router.refresh();
                      } catch (cause) {
                        setNewModuleFeedback((current) => ({
                          ...current,
                          [course.id]: { error: cause instanceof Error ? cause.message : 'Unable to create module' }
                        }));
                      }
                    }}
                  >
                    Add module
                  </Button>
                </div>
                <FormNotice error={newModuleFeedback[course.id]?.error} success={newModuleFeedback[course.id]?.success} />
              </div>
            </DetailSection>
          </div>
        </div>
      ))}
    </div>
  );
}
