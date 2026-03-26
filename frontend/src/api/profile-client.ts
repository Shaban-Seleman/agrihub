import { apiFetch } from './client';

export const updateSharedProfile = (payload: unknown) => apiFetch('/api/v1/me/profile', { method: 'PUT', body: JSON.stringify(payload) });
export const updateFarmerProfile = (payload: unknown) => apiFetch('/api/v1/me/farmer-profile', { method: 'PUT', body: JSON.stringify(payload) });
