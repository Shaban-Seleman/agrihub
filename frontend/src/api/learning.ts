import { serverApiFetch } from './server';

export const listCourses = () => serverApiFetch<any>('/api/v1/courses?page=0&size=20');
export const getCourse = (courseId: string) => serverApiFetch<any>(`/api/v1/courses/${courseId}`);
export const getLesson = (lessonId: string) => serverApiFetch<any>(`/api/v1/lessons/${lessonId}`);
export const getLessonFeedback = (lessonId: string) => serverApiFetch<any>(`/api/v1/lessons/${lessonId}/feedback`);
export const getCourseProgress = () => serverApiFetch<any>('/api/v1/me/course-progress');
export const getLearningHome = () => serverApiFetch<any>('/api/v1/me/learning-home');

export const adminListCourses = () => serverApiFetch<any>('/api/v1/admin/courses?page=0&size=20');
export const getAdminCourse = (courseId: string | number) => serverApiFetch<any>(`/api/v1/admin/courses/${courseId}`);
export const getAdminLessonFeedbackSummary = (lessonId: string | number) =>
  serverApiFetch<any>(`/api/v1/admin/lessons/${lessonId}/feedback-summary`);
