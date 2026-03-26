import { apiFetch } from './client';

export const updateBusinessVerification = (id: string | number, status: string) =>
  apiFetch(`/api/v1/admin/businesses/${id}/verification?status=${status}`, { method: 'PATCH' });
