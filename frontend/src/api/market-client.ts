import { apiFetch } from './client';

export const createProduce = (payload: unknown) => apiFetch('/api/v1/produce-listings', { method: 'POST', body: JSON.stringify(payload) });
export const updateProduce = (id: string, payload: unknown) => apiFetch(`/api/v1/produce-listings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const createDemand = (payload: unknown) => apiFetch('/api/v1/demand-listings', { method: 'POST', body: JSON.stringify(payload) });
export const updateDemand = (id: string, payload: unknown) => apiFetch(`/api/v1/demand-listings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const moderateProduce = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/produce-listings/${id}/status?status=${status}`, { method: 'PATCH' });
export const moderateDemand = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/demand-listings/${id}/status?status=${status}`, { method: 'PATCH' });
