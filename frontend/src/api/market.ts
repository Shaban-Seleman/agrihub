import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const getMarketSummary = () => serverApiFetch<any>('/api/v1/market/summary');
export const listProduce = () => serverApiFetch<any>('/api/v1/market/produce?page=0&size=20');
export const listDemand = () => serverApiFetch<any>('/api/v1/market/demand?page=0&size=20');
export const getProduceListing = (id: string) => serverApiFetch<any>(`/api/v1/produce-listings/${id}`);
export const getDemandListing = (id: string) => serverApiFetch<any>(`/api/v1/demand-listings/${id}`);
export const listMyProduce = () => serverApiFetch<any>('/api/v1/me/produce-listings?page=0&size=20');
export const listMyDemand = () => serverApiFetch<any>('/api/v1/me/demand-listings?page=0&size=20');

export const createProduce = (payload: unknown) => apiFetch('/api/v1/produce-listings', { method: 'POST', body: JSON.stringify(payload) });
export const updateProduce = (id: string, payload: unknown) => apiFetch(`/api/v1/produce-listings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deactivateProduce = (id: string | number) => apiFetch(`/api/v1/produce-listings/${id}/deactivate`, { method: 'PATCH' });
export const createDemand = (payload: unknown) => apiFetch('/api/v1/demand-listings', { method: 'POST', body: JSON.stringify(payload) });
export const updateDemand = (id: string, payload: unknown) => apiFetch(`/api/v1/demand-listings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deactivateDemand = (id: string | number) => apiFetch(`/api/v1/demand-listings/${id}/deactivate`, { method: 'PATCH' });

export const adminProduceListings = () => serverApiFetch<any>('/api/v1/admin/produce-listings?page=0&size=20');
export const adminDemandListings = () => serverApiFetch<any>('/api/v1/admin/demand-listings?page=0&size=20');
export const moderateProduce = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/produce-listings/${id}/status?status=${status}`, { method: 'PATCH' });
export const moderateDemand = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/demand-listings/${id}/status?status=${status}`, { method: 'PATCH' });
