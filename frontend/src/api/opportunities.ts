import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const listOpportunities = () => serverApiFetch<any>('/api/v1/opportunities?page=0&size=20');
export const getOpportunity = (id: string) => serverApiFetch<any>(`/api/v1/opportunities/${id}`);
export const getOpportunitySummary = () => serverApiFetch<any>('/api/v1/opportunities/summary');
export const listMyOpportunities = () => serverApiFetch<any>('/api/v1/me/opportunities?page=0&size=20');

export const createOpportunity = (payload: unknown) => apiFetch('/api/v1/opportunities', { method: 'POST', body: JSON.stringify(payload) });
export const updateOpportunity = (id: string, payload: unknown) => apiFetch(`/api/v1/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const adminOpportunities = () => serverApiFetch<any>('/api/v1/admin/opportunities?page=0&size=20');
export const moderateOpportunity = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/opportunities/${id}/status?status=${status}`, { method: 'PATCH' });
