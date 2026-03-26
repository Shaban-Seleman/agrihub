import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const listDirectory = () => serverApiFetch<any>('/api/v1/directory?page=0&size=20');
export const getDirectoryItem = (id: string) => serverApiFetch<any>(`/api/v1/directory/${id}`);
export const getDirectorySummary = () => serverApiFetch<any>('/api/v1/directory/summary');
export const adminBusinesses = () => serverApiFetch<any>('/api/v1/admin/businesses?page=0&size=20');
export const updateBusinessVerification = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/businesses/${id}/verification?status=${status}`, { method: 'PATCH' });
