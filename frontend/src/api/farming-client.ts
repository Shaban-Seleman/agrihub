import { apiFetch } from './client';

export const fetchMyActivities = () => apiFetch<any>('/api/v1/me/farming-activities?page=0&size=100');
export const createActivity = (payload: unknown) => apiFetch('/api/v1/farming-activities', { method: 'POST', body: JSON.stringify(payload) });
export const updateActivity = (activityId: string, payload: unknown) =>
  apiFetch(`/api/v1/farming-activities/${activityId}`, { method: 'PUT', body: JSON.stringify(payload) });
