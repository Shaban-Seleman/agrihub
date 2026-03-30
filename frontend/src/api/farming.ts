import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const listMyActivities = () => serverApiFetch<any>('/api/v1/me/farming-activities?page=0&size=20');
export const getActivity = (activityId: string) => serverApiFetch<any>(`/api/v1/farming-activities/${activityId}`);
export const getFarmingSummary = () => serverApiFetch<any>('/api/v1/me/farming-summary');
export const fetchMyActivities = () => apiFetch<any>('/api/v1/me/farming-activities?page=0&size=100');

export const createActivity = (payload: unknown) => apiFetch('/api/v1/farming-activities', { method: 'POST', body: JSON.stringify(payload) });
export const updateActivity = (activityId: string, payload: unknown) =>
  apiFetch(`/api/v1/farming-activities/${activityId}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteActivity = (activityId: string) => apiFetch(`/api/v1/farming-activities/${activityId}`, { method: 'DELETE' });
export const adminListActivities = () => serverApiFetch<any>('/api/v1/admin/farming-activities?page=0&size=50');
export const getAdminFarmingSummary = () => serverApiFetch<any>('/api/v1/admin/farming-activities/summary');
