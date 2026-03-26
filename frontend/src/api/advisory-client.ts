import { apiFetch } from './client';

export const saveAdvisory = (id: string | null, payload: unknown) =>
  apiFetch(id ? `/api/v1/admin/advisory/${id}` : '/api/v1/admin/advisory', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
export const archiveAdvisory = (id: string | number) =>
  apiFetch(`/api/v1/admin/advisory/${id}/archive`, { method: 'PATCH' });
