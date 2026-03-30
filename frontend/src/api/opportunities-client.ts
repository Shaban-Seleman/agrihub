import { apiFetch } from './client';

export const createOpportunity = (payload: unknown) => apiFetch('/api/v1/opportunities', { method: 'POST', body: JSON.stringify(payload) });
export const updateOpportunity = (id: string, payload: unknown) => apiFetch(`/api/v1/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deactivateOpportunity = (id: string | number) => apiFetch(`/api/v1/opportunities/${id}/deactivate`, { method: 'PATCH' });
export const moderateOpportunity = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/opportunities/${id}/status?status=${status}`, { method: 'PATCH' });
