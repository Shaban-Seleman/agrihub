import { apiFetch } from './client';

export const completeLesson = (lessonId: string) => apiFetch(`/api/v1/lessons/${lessonId}/complete`, { method: 'POST' });
export const saveLessonFeedback = (lessonId: string, payload: { helpful: boolean; comment?: string }) =>
  apiFetch(`/api/v1/lessons/${lessonId}/feedback`, { method: 'POST', body: JSON.stringify(payload) });
export const saveCourse = (courseId: string | number | null, payload: unknown) =>
  apiFetch(courseId ? `/api/v1/admin/courses/${courseId}` : '/api/v1/admin/courses', {
    method: courseId ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });
export const archiveCourse = (courseId: string | number) =>
  apiFetch(`/api/v1/admin/courses/${courseId}/archive`, { method: 'PATCH' });
