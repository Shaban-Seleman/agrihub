import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const listAdvisory = () => serverApiFetch<any>('/api/v1/advisory?page=0&size=20');
export const getAdvisory = (id: string) => serverApiFetch<any>(`/api/v1/advisory/${id}`);
export const getAdvisorySummary = () => serverApiFetch<any>('/api/v1/advisory/summary');
export const getAdvisoryRecommendations = () => serverApiFetch<any>('/api/v1/me/advisory-recommendations');

export const adminAdvisory = () => serverApiFetch<any>('/api/v1/admin/advisory?page=0&size=20');
export const saveAdvisory = (id: string | null, payload: unknown) =>
  apiFetch(id ? `/api/v1/admin/advisory/${id}` : '/api/v1/admin/advisory', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
export const archiveAdvisory = (id: string | number) =>
  apiFetch(`/api/v1/admin/advisory/${id}/archive`, { method: 'PATCH' });
