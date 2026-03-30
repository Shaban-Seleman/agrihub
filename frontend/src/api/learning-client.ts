import { apiFetch } from './client';

export const completeLesson = (lessonId: string) => apiFetch(`/api/v1/lessons/${lessonId}/complete`, { method: 'POST' });
export const saveLessonFeedback = (lessonId: string, payload: { helpful: boolean; comment?: string }) =>
  apiFetch(`/api/v1/lessons/${lessonId}/feedback`, { method: 'POST', body: JSON.stringify(payload) });
export const saveCourse = (courseId: string | number | null, payload: unknown) =>
  apiFetch(courseId ? `/api/v1/admin/courses/${courseId}` : '/api/v1/admin/courses', {
    method: courseId ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });
export const saveCourseModule = (courseId: string | number, payload: unknown) =>
  apiFetch(`/api/v1/admin/courses/${courseId}/modules`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
export const updateCourseModule = (moduleId: string | number, payload: unknown) =>
  apiFetch(`/api/v1/admin/course-modules/${moduleId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
export const saveLesson = (moduleId: string | number, payload: unknown) =>
  apiFetch(`/api/v1/admin/modules/${moduleId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
export const updateLesson = (lessonId: string | number, payload: unknown) =>
  apiFetch(`/api/v1/admin/lessons/${lessonId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
export const fetchLessonFeedbackSummary = (lessonId: string | number) =>
  apiFetch(`/api/v1/admin/lessons/${lessonId}/feedback-summary`);
export const archiveCourse = (courseId: string | number) =>
  apiFetch(`/api/v1/admin/courses/${courseId}/archive`, { method: 'PATCH' });
